import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ref, push } from 'firebase/database';
import { database } from '../../config/firebase';
import Swal from 'sweetalert2';

//Import Validators
import { requiredInput, setLongString } from '../../utils/validator';

const AddPackage = () => {
    const currentDate=()=>{let dat= new Date();return `${dat.getDate()}/${dat.getMonth()+1}/${dat.getFullYear()}`;}
    
    const [newBox, setNewBox] = useState({
        no: '',
        date: currentDate(),
        by: '',
        ship: '',
        total: '',
        products: []
    });
    const [products, setproducts] = useState([]);
    const [errors, setErrors] = useState({});

    const alertOn = (title, message, icon) => {
        Swal.fire({
            title: title,
            text: message,
            icon: icon,
            confirmButtonText: 'OK'
          })
    }

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
        let validacion = requiredInput(newBox.no);
        if (validacion) {
            validaciones.no = validacion;
        }
        validacion = requiredInput(newBox.date);
        if (validacion) {
            validaciones.date = validacion;
        }
        validacion = requiredInput(newBox.by);
        if (validacion) {
            validaciones.by = validacion;
        }
        validacion = requiredInput(newBox.ship);
        if (validacion) {
            validaciones.ship = validacion;
        }
        validacion = requiredInput(newBox.total);
        if (validacion) {
            validaciones.total = validacion;
        }
        validacion = requiredInput(document.getElementById("products-li").value);
        if (validacion) {
            validaciones.products = validacion;
        }
        //Validate a field, with limit o characters
        validacion = setLongString(newBox.no, 13);
        if (validacion) {
            validaciones.no = validacion;
        }

        if (Object.keys(validaciones).length > 0) {
            setErrors({ ...validaciones });
            return
        }
    }

    const handleSave = async (e) => {
        e.preventDefault();
        if (Object.keys(errors).length > 0) {
            alertOn("Imposible agregar","Hay errores en los campos, corrígelos antes de continuar.","error");
        } else {
            push(ref(database, 'Boxes'), newBox)
            .then(response => {
                alertOn("Guardado", "Se agregó correctamente", "success");
            })
            .catch(error => {
                alertOn("Error", "Ha ocurrido un error"+error, "error");
            })
        }
    }

    const saveProducts = async(e) => {
        e.preventDefault();
        let textAreaContent = document.getElementById("products-li").value;
        let getProducts = textAreaContent.split(/\n/);
        let producto = [];
        getProducts.forEach((prod, index) => {
            let properties = prod.split("-");
            producto.push({name: properties[0].replace(" ", "").toLowerCase(),
                quantity: parseInt(properties[1])
            })
        });
        setproducts(producto);
        setNewBox({
            ...newBox,
            ['products']: producto
        });
    }

    
    
    return (
        <div className='row row-cols-lg-2 row-cols-sm-1 m-2 justify-content-center mt-5'>
        <form className="forms-sample   card" noValidate>
            <div className="form-group m-2">
                <label htmlFor="date">Fecha*</label>
                <input 
                type="text" 
                className={(errors.date && 'form-control is-invalid') || 'form-control is-valid'}
                id="date"
                name='date'
                placeholder="Fecha"
                // defaultValue={currentDate()}
                defaultValue={newBox.date}
                onChange={handleChange}
                onBlur={handleValidate} />
                <div className='invalid-feedback'>{errors.date}</div>
            </div>
            <div className="row row-cols-md-2 row-cols-sm-1 m-2">
                <div className="form-group p-1">
                    <label htmlFor="no">No. guía*</label>
                    <input 
                    type="text" 
                    className={(errors.no && 'form-control is-invalid') || 'form-control is-valid'}
                    id="no" 
                    name='no'
                    placeholder="Número guía"
                    defaultValue={newBox.no}
                    onChange={handleChange}
                    onBlur={handleValidate} />
                    <div className='invalid-feedback'>{errors.no}</div>
                </div>
                <div className="form-group p-1">
                    <label htmlFor="by">Por</label>
                        <select
                            className={(errors.by && 'form-control is-invalid') || 'form-control is-valid'}
                            defaultValue={newBox.by}
                            id="by"
                            name='by'
                            onChange={handleChange}
                            onBlur={handleValidate}
                            aria-label="Paquetería">
                            <option >Paquetería</option>
                            <option value="Correos de México">Correos de México</option>
                            <option value="UPS">UPS</option>
                        </select>
                    {/* <input 
                    type="text" 
                    className={errors.by && 'form-control is-invalid' || 'form-control is-valid'}
                    id="by" 
                    name='by'
                    placeholder="Paqueteria"
                    defaultValue={newBox.by}
                    onChange={handleChange}
                    onBlur={handleValidate} /> */}
                    <div className='invalid-feedback'>{errors.by}</div>
                </div>
            </div>
            <div className="row m-2">
                <div className="col-md-6 col-lg-6">
                    <div className="form-group row">
                        <label className="col-sm-3 col-form-label"
                        //   style="padding-left: 3px;padding-right: 1px;"
                        >Envío*</label>
                        <div className="col-sm-9">
                            <input 
                            type="number" 
                            className={(errors.ship && 'form-control is-invalid') || 'form-control is-valid'}
                            id="ship"
                            name='ship'
                            placeholder="Costo de envío"
                            defaultValue={newBox.ship}
                            onChange={handleChange}
                            onBlur={handleValidate} />
                            <div className='invalid-feedback'>{errors.ship}</div>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 col-lg-6">
                    <div className="form-group row">
                        <label className="col-sm-3 col-form-label"
                        //   style="padding-left: 3px;padding-right: 1px;"
                        >Precio total*</label>
                        <div className="col-sm-9">
                            <input 
                            type="number" 
                            className={(errors.total && 'form-control is-invalid') || 'form-control is-valid'}
                            id="precio"
                            name='total'
                            placeholder="Costo total"
                            defaultValue={newBox.total}
                            onChange={handleChange}
                            onBlur={handleValidate} />
                            <div className='invalid-feedback'>{errors.total}</div>
                        </div>
                    </div>
                </div>
                <div className="col-md-9 col-lg-9">
                    <div className="form-group row">
                        <label className="col-sm-3 col-form-label"
                        //   style="padding-left: 3px;padding-right: 1px;"
                        >Productos*</label>
                        <div className="col-sm-9">
                            <textarea
                            className={(errors.products && 'form-control is-invalid') || 'form-control is-valid'}
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
                <div className='col-md-12 col-lg-12 d-flex justify-content-center mt-2'>
                    <button className='btn btn-success w-50' onClick={handleSave}>Guardar</button>
                </div>
            </div>

        </form>
        </div>
    )
}

export default AddPackage;