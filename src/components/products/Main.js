import React, { useState, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import Row from './Row';
import { onValue, ref, push, update, orderByChild, query } from 'firebase/database';
import { database } from '../../config/firebase';
// import { Card } from '@material-ui/core';
import Swal from 'sweetalert2';

//Import Validators
import { requiredInput } from '../../utils/validator';

const Main = () => {
    const [products, setProducts] = useState([]);
    const [product, setProduct] = useState({
        name: '',
        price: 0,
        quantity: 0
    });
    const [productE, setProductE] = useState({
        id: '',
        name: '',
        price: 0,
        quantity: 0
    });
    const [errors, setErrors] = useState({});
    const [errorsEdit, setErrorsEdit] = useState({});

    const onEdit = async (id) => {
        let product = await products.filter(function(product) {
            return product.id == id; })
            setProductE(product[0])
        // products.forEach((product) => {
        //     if (product.id === id) {
        //         setProductE({ id: product.id, price: product.price, name: product.name, quantity: product.quantity });
        //     }
        // })
        console.log(productE);
    }

    const renderRows = () => (
        products.map((row, index) => (
            <Row key={index} id={row.id} name={row.name} price={row.price} quantity={row.quantity} onEdit={onEdit} />
        ))
    )

    useEffect(() => {
        onValue(
            query(ref(database, 'products')),
            // ref(database, "products"),
            (Snapshot) => {
                const productsRes = [];
                Snapshot.forEach(item => {
                    const product = {
                        id: item.key,
                        ...item.val()
                    };
                    productsRes.push(product);
                })
                setProducts(productsRes);
            }, (error) => { console.log(error); }
        )
    }, []);

    const handleChange = (e) => {

        if (e.target.name === "name") {
            e.target.value = e.target.value.replace(/ /g, "").toLowerCase();
            setProduct({
                ...product,
                [e.target.name]: e.target.value
            })
        }
        if (e.target.name === "price") {
            setProduct({
                ...product,
                [e.target.name]: parseFloat(e.target.value)
            })
        }
        if (e.target.name === "quantity") {
            setProduct({
                ...product,
                [e.target.name]: parseInt(e.target.value)
            })
        };

        //Remove the error to the edited property
        delete errors[e.target.name];
        setErrors({ ...errors });
    }

    const handleChangeEdit = (e) => {
        if (e.target.name === "name") {
            e.target.value = e.target.value.replace(/ /g, "").toLowerCase();
            setProductE({
                ...productE,
                [e.target.name]: e.target.value
            })
        }

        if (e.target.name === "price") {
            setProductE({
                ...productE,
                [e.target.name]: parseFloat(e.target.value)
            })
        }
        if (e.target.name === "quantity") {
            setProductE({
                ...productE,
                [e.target.name]: parseInt(e.target.value)
            })
        };
        //Remove the error to the edited property
        delete errorsEdit[e.target.name];
        setErrorsEdit({ ...errorsEdit });
    }

    const handleValidate = (e) => {
        const validaciones = {};
        //apply validation to correspond field
        //Validate required fields
        let validacion = requiredInput(product.name);
        if (validacion) {
            validaciones.name = validacion;
        }
        validacion = requiredInput(product.price);
        if (validacion) {
            validaciones.price = validacion;
        }
        validacion = requiredInput(product.quantity);
        if (validacion) {
            validaciones.quantity = validacion;
        }

        //Validate a field, with limit o characters
        // validacion = setLongString(packet.no, 13);
        // if (validacion) {
        //     validaciones.no = validacion;
        // }

        if (Object.keys(validaciones).length > 0) {
            setErrors({ ...validaciones });
            return
        }
    }
    const handleValidateEdit = (e) => {
        const validaciones = {};
        //apply validation to correspond field
        //Validate required fields
        let validacion = requiredInput(productE.name);
        if (validacion) {
            validaciones.name = validacion;
        }
        validacion = requiredInput(productE.price);
        if (validacion) {
            validaciones.price = validacion;
        }
        validacion = requiredInput(productE.quantity);
        if (validacion) {
            validaciones.quantity = validacion;
        }

        if (Object.keys(validaciones).length > 0) {
            setErrorsEdit({ ...validaciones });
            return
        }
    }

    const handleSave = async (e) => {
        e.preventDefault();
        // setErrorForm('');
        let isThere = products.some((prod) => {
            return prod.name === product.name;
        })
        if (Object.keys(errors).length > 0) {
            alertOn("Imposible guardar", "Hay errores en los campos, corrígelos antes de continuar.", "error");
            return null;
        }
        if (isThere) {
            alertOn("Duplicado", "Ya existe ese producto.", "warning");
            return null;
        }
        console.log(product);
        push(ref(database, 'products'), product)
            .then(response => {
                alertOn("Guardado", "Se agregó correctamente", "success");
                setProduct({});
            })
            .catch(error => {
                console.log(error);
            })
    }

    const handleUpdate = async (e) => {
        e.preventDefault();
        // setErrorForm('');
        let isThere = products.some((product) => {
            return product.name === productE.name && product.id !== productE.id;
        })
        if (Object.keys(errorsEdit).length > 0) {
            alertOn("Imposible guardar", "Hay errores en los campos, corrígelos antes de continuar.", "error");
            return null;
        }
        if (isThere) {
            alertOn("Duplicado", "Ya existe ese producto.", "warning");
            return null;
        }
        delete productE["id"];
        update(ref(database, 'products/' + productE.id), productE)
            .then(() => {
                alertOn("Actualizado", "Se actualizó correctamente", "success");
                setProductE({});
            })
            .catch(error => {
                console.log(error);
            })
    }

    const alertOn = (title, message, icon) => {
        Swal.fire({
            title: title,
            text: message,
            icon: icon,
            confirmButtonText: 'OK'
        })
    }

    return (
        <div>
            <div className='w-100 ps-5'><Link type="button" className="btn btn-outline-info ms-5 mt-3" data-bs-toggle="modal" data-bs-target="#exampleModal">Agregar Producto</Link></div>

            <div className='d-flex justify-content-center mt-3'>
                <div className='w-75 card'>
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">Nombre</th>
                                <th scope="col">Precio</th>
                                <th scope="col">Existencias</th>
                                <th scope="col"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderRows()}
                        </tbody>
                    </table>
                </div>


                {/* <!-- Modal --> */}
                <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel">Agregar Producto</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <form className="forms-sample m-1 card" onSubmit={handleSave} noValidate>
                                    <div className="form-group m-2">
                                        <label htmlFor="name">Nombre*</label>
                                        <input
                                            type="text"
                                            className={errors.name && 'form-control is-invalid' || 'form-control is-valid'}
                                            id="name"
                                            name='name'
                                            placeholder="Nombre sin espacios"
                                            defaultValue={''}
                                            onChange={handleChange}
                                            onBlur={handleValidate} />
                                        <div className='invalid-feedback'>{errors.name}</div>
                                    </div>
                                    <div className="row m-2">
                                        <div className="col-md-6 col-lg-6">
                                            <div className="form-group">
                                                <label className="col-sm-6 col-form-label"
                                                >Price*</label>
                                                <div className="col-sm-9">
                                                    <input
                                                        type="number"
                                                        className={errors.price && 'form-control is-invalid' || 'form-control is-valid'}
                                                        id="price"
                                                        name='price'
                                                        defaultValue={''}
                                                        onChange={handleChange}
                                                        onBlur={handleValidate} />
                                                    <div className='invalid-feedback'>{errors.price}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-6">
                                            <div className="form-group">
                                                <label className="col-sm-6 col-form-label"
                                                >Cantidad*</label>
                                                <div className="col-sm-9">
                                                    <input
                                                        type="number"
                                                        className={errors.quantity && 'form-control is-invalid' || 'form-control is-valid'}
                                                        id="quantity"
                                                        name='quantity'
                                                        defaultValue={''}
                                                        onChange={handleChange}
                                                        onBlur={handleValidate} />
                                                    <div className='invalid-feedback'>{errors.quantity}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary" onClick={handleSave}>Guardar</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* <!-- Edit ProductModal --> */}
                <div className="modal fade" id="editProductModal" tabIndex="-1" aria-labelledby="editProductModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="editProductModalLabel">Editar producto</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <form className="forms-sample m-1 card" onSubmit={handleUpdate} noValidate>
                                    <div className="form-group m-2">
                                        <label htmlFor="name">Nombre*</label>
                                        <input
                                            type="text"
                                            className={errorsEdit.name && 'form-control is-invalid' || 'form-control is-valid'}
                                            // id="name"
                                            name='name'
                                            placeholder="Nombre sin espacios"
                                            defaultValue={productE.name}
                                            onChange={handleChangeEdit}
                                            onBlur={handleValidateEdit} />
                                        <div className='invalid-feedback'>{errorsEdit.name}</div>
                                    </div>
                                    <div className="row m-1">
                                        <div className="col-md-6 col-lg-6">
                                            <label className="col-sm-6 col-form-label"
                                            >Price*</label>
                                            <input
                                                type="number"
                                                className={errorsEdit.price && 'form-control is-invalid' || 'form-control is-valid'}
                                                // id="price"
                                                name='price'
                                                defaultValue={productE.price}
                                                onChange={handleChangeEdit}
                                                onBlur={handleValidateEdit} />
                                            <div className='invalid-feedback'>{errorsEdit.price}</div>
                                        </div>
                                        <div className="col-md-6 col-lg-6">
                                            {/* <div className="form-group"> */}
                                            <label className="col-sm-6 col-form-label"
                                            >Cantidad*{productE.quantity}</label>
                                            <input
                                                type="number"
                                                className={errorsEdit.quantity && 'form-control is-invalid' || 'form-control is-valid'}
                                                // id="quantity"
                                                name='quantity'
                                                onChange={handleChangeEdit}
                                                onBlur={handleValidateEdit}
                                                defaultValue={productE.quantity} />
                                            <div className='invalid-feedback'>{errorsEdit.quantity}</div>
                                            {/* </div> */}
                                        </div>
                                    </div>

                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                                <button type="button" className="btn btn-primary" onClick={handleUpdate}>Actualizar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Main;
