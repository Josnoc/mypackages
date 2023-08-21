import React, { useState, useEffect } from 'react';
import { onValue, ref, push, query, orderByChild, startAt } from 'firebase/database';
import { database } from '../../config/firebase';
import Input from './Input';
import Swal from 'sweetalert2';

//Import Validators
import { requiredInput } from '../../utils/validator';

const CreatePackage = () => {
    const [newBox, setNewBox] = useState({
        by: '',
        products: []
    });
    const [products, setProducts] = useState([]);
    const [errors, setErrors] = useState({});

    const alertOn = (title, message, icon) => {
        Swal.fire({
            title: title,
            text: message,
            icon: icon,
            confirmButtonText: 'OK'
        })
    }

    useEffect(() => {
        onValue(
            query(ref(database, 'products'), orderByChild('quantity'), startAt(1)),
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
    }, [0]);

    const renderInputs = () => (
        products.map((product, index) => (
            <Input key={index} name={product.name} quantity={product.quantity} addProduct={addProduct} />
        ))
    )

    const handleChange = (e) => {
        setNewBox({
            ...newBox,
            [e.target.name]: e.target.value
        })

        //Remove the error to the edited property
        delete errors[e.target.name];
        setErrors({ ...errors });
    }

    const handleValidate = (e) => {
        const validaciones = {};
        delete errors['products'];
        //apply validation to correspond field
        //Validate required fields
        let validacion = requiredInput(newBox.by);
        if (validacion) {
            validaciones.by = validacion;
        }
        validacion = requiredInput(document.getElementById("products-li").value);
        if (validacion) {
            validaciones.products = validacion;
        }

        if (Object.keys(validaciones).length > 0) {
            setErrors({ ...validaciones });
            return
        }
    }

    const handleSave = async (e) => {
        e.preventDefault();
        // setErrorForm('');
        if (Object.keys(errors).length > 0) {
            alertOn("Imposible agregar", "Hay errores en los campos, corrígelos antes de continuar.", "error");
        } else {
            push(ref(database, 'packets'), newBox)
                .then(response => {
                    alertOn("Guardado", "Se agregó correctamente", "success");
                })
                .catch(error => {
                    alertOn("Error", "Ha ocurrido un error" + error, "error");
                })
        }
    }

    const addProduct = (name, quantity) => {
        let actualContent = document.getElementById("products-li").value;
        if (actualContent.trim().length > 0) {
            document.getElementById("products-li").value = actualContent + `\n${name}-${quantity}`;
        } else {
            document.getElementById("products-li").value = `${name}-${quantity}`;
        }

    }

    const saveProducts = async (e) => {
        e.preventDefault();
        let textAreaContent = document.getElementById("products-li").value;
        let getProducts = textAreaContent.split(/\n/);
        let producto = [];
        getProducts.forEach((prod, index) => {
            let properties = prod.split("-");
            producto.push({
                name: properties[0].replace(" ", "").toLowerCase(),
                quantity: parseInt(properties[1])
            })
        });
        setNewBox({
            ...newBox,
            ['products']: producto
        });
    }



    return (
        <div className='row row-cols-lg-2 row-cols-sm-1 justify-content-center mt-5'>
            <div>
                <div className='forms-sample ms-2 me-2 card'>
                {renderInputs()}
                </div>
            </div>
            <form noValidate>
                <div className='ms-3 me-3 forms-sample  card'>
                <div className="row row-cols-md-2 row-cols-sm-1 m-2">
                    <div className="form-group p-1">
                        <label htmlFor="by">Por donde enviar</label>
                        <select
                            className={errors.by && 'form-control is-invalid' || 'form-control is-valid'}
                            defaultValue={newBox.by}
                            id="by"
                            name='by'
                            onChange={handleChange}
                            onBlur={handleValidate}
                            aria-label="Default select example">
                            <option >Open this select menu</option>
                            <option value="Correos de México">Correos de México</option>
                            <option value="UPS">UPS</option>
                        </select>
                        <div className='invalid-feedback'>{errors.by}</div>
                    </div>
                </div>
                <div className="row m-2">
                    <div className="col-md-9 col-lg-9">
                        <div className="form-group row">
                            <label className="col-sm-3 col-form-label"
                            //   style="padding-left: 3px;padding-right: 1px;"
                            >Productos*</label>
                            <div className="col-sm-9">
                                <textarea
                                    className={errors.products && 'form-control is-invalid' || 'form-control is-valid'}
                                    id="products-li"
                                    name='products'
                                    placeholder="Nombre-Cantidad
                            Nombre-Cantidad"
                                    onBlur={handleValidate}
                                    rows={8}></textarea>
                                <div className='invalid-feedback'>{errors.products}</div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 col-lg-3">
                        <div className="form-group row">
                            <button className='btn btn-outline-primary' onClick={saveProducts}>Aplicar</button>
                        </div>
                    </div>
                    <div className='col-md-12 mt-2 col-lg-12 d-flex justify-content-center'>
                        <button className='btn btn-success w-50' onClick={handleSave}>Guardar</button>
                    </div>
                </div>
                </div>
            </form>
        </div>
    )
}

export default CreatePackage;