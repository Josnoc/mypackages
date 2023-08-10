import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { onValue, ref, update, child, orderByChild, equalTo, query } from 'firebase/database';
import { database } from '../../config/firebase';
import Swal from 'sweetalert2';

//Import Validators
import { requiredInput, onlyLetters, onlyNumbers, setLongString, valiDate } from '../../utils/validator';

const EditPackage = (props) => {
    const [user, setUser] = useState("true");
    const [packet, setPacket] = useState([]);
    const [packetU, setPacketU] = useState([]);
    const [ edit, setEdit ] = useState(false);
    const { id } = useParams(props);
    const products = [];
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
        if (localStorage.getItem("token") && localStorage.getItem("token") === "josnoc.gms@gmail.com") {
            setUser("false");
            setEdit(true);
        }
        onValue(
            query(ref(database, 'Boxes'), orderByChild('no'), equalTo(id)),
            (Snapshot) => {
                if (Snapshot.size > 0) {
                    Snapshot.forEach(item => {
                        const product = {
                            id: item.key,
                            ...item.val()
                        };
                        setPacket(product);
                        products.push(product.products);
                    })
                    renderProductos();
                } else {
                    document.getElementById("content_packages").setAttribute("hidden", true);
                    document.getElementById("No_prods").removeAttribute("hidden");
                }
            }, (error) => { console.log(error); }
        )
        // renderProduct();
    }, []);

    const handleChange = (e) => {
        setPacket({
            ...packet,
            [e.target.name]: e.target.value
        })
        //Remove the error to the edited property
        delete errors[e.target.name];
        setErrors({ ...errors });
    }

    const handleValidate = (e) => {
        console.log(packet);
        const validaciones = {};
        //apply validation to correspond field
        //Validate required fields
        let validacion = requiredInput(packet.no);
        if (validacion) {
            validaciones.no = validacion;
        }
        validacion = requiredInput(packet.date);
        if (validacion) {
            validaciones.date = validacion;
        }
        // validacion = valiDate(packet.date);
        // if (validacion) {
        //     validaciones.date = validacion;
        // }
        validacion = requiredInput(packet.by);
        if (validacion) {
            validaciones.by = validacion;
        }
        validacion = requiredInput(packet.ship);
        if (validacion) {
            validaciones.ship = validacion;
        }
        validacion = requiredInput(packet.total);
        if (validacion) {
            validaciones.total = validacion;
        }
        validacion = requiredInput(document.getElementById("products-li").value);
        if (validacion) {
            validaciones.products = validacion;
        }
        //Validate a field, with limit o characters
        validacion = setLongString(packet.no, 13);
        if (validacion) {
            validaciones.no = validacion;
        }

        if (Object.keys(validaciones).length > 0) {
            setErrors({ ...validaciones });
            return
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
        setPacket({
            ...packet,
            ['products']: producto
        });
    }

    const handleUpdate = () => {
        if (Object.keys(errors).length > 0) {
            alertOn("Imposible actualizar","Hay errores en los campos, corrígelos antes de continuar.","error");
        } else {
            update(ref(database, 'Boxes/'+packet.id), packet)
            .then(response => {
                alertOn("Actualizado", "Se actualizó correctamente", "success");
                // setProductE({});
            })
            .catch(error => {
                alertOn("Error", "Ha ocurrido un error"+error, "error");
            })
        }
        
    }

    const renderProductos = () => {
        let productos = products[0], list = "";
        productos.forEach((product, index) => {
            if (index > 0 ) { list+=`\n`; }
            list += `${product.name}-${product.quantity}`;
        })
        document.getElementById("products-li").innerHTML=list;
    }

    const handleCopy = (e) => {
        e.preventDefault()
        navigator.clipboard.writeText(packet.no);
        document.getElementById("copyNo").innerHTML=`<i class="bi bi-clipboard-check-fill"></i>`
    }

    return (
        <div>
            <div className='d-flex justify-content-center mt-5'>
            <div hidden id='No_prods'><p>Sin coincidencias</p></div>
            <form className="forms-sample m-1 w-50 card" id='content_packages' noValidate>
                <div className="form-group m-2">
                    <label htmlFor="date">Fecha*</label>
                    {edit && (<input
                        type="text"
                        className={errors.date && 'form-control is-invalid' || 'form-control is-valid'}
                        id="date"
                        name='date'
                        placeholder="Descripción o título del producto"
                        defaultValue={packet.date}
                        onChange={handleChange}
                        onBlur={handleValidate} />) || (<input
                            type="text"
                            className='form-control'
                            id="date"
                            name='date'
                            placeholder="Descripción o título del producto"
                            defaultValue={packet.date}
                            readOnly />)}
                    <div className='invalid-feedback'>{errors.date}</div>
                </div>
                <div className="row row-cols-md-2 row-cols-sm-1 m-2">
                    <div className="form-group p-1">
                        <label htmlFor="no">No. guía*</label>
                        <div class="input-group mb-3">
                            {edit && (<input
                                type="text"
                                className={errors.no && 'form-control is-invalid' || 'form-control is-valid'}
                                id="no"
                                name='no'
                                placeholder="SKU"
                                defaultValue={packet.no}
                                onChange={handleChange}
                                onBlur={handleValidate} />) || (<input
                                    type="text"
                                    className='form-control'
                                    id="no"
                                    name='no'
                                    readOnly
                                    placeholder="SKU"
                                    defaultValue={packet.no} />)}
                            <button className="btn btn-outline-secondary" type="button" id="copyNo" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Copiar al portapapeles" onClick={handleCopy}><i class="bi bi-clipboard"></i></button>
                        </div>
                            <div className='invalid-feedback'>{errors.no}</div>
                    </div>
                    <div className="form-group p-1">
                        <label htmlFor="by">Por</label>
                        {edit && (<input
                            type="text"
                            className={errors.by && 'form-control is-invalid' || 'form-control is-valid'}
                            id="by"
                            name='by'
                            placeholder="Location"
                            defaultValue={packet.by}
                            onChange={handleChange}
                            onBlur={handleValidate} />) || (<input
                                type="text"
                                className='form-control'
                                id="by"
                                name='by'
                                readOnly
                                placeholder="Location"
                                defaultValue={packet.by} />)}
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
                                {edit && (<input
                                    type="number"
                                    className={errors.ship && 'form-control is-invalid' || 'form-control is-valid'}
                                    id="ship"
                                    name='ship'
                                    defaultValue={packet.ship}
                                    onChange={handleChange}
                                    onBlur={handleValidate} />) || (<input
                                        type="number"
                                        className='form-control'
                                        id="ship"
                                        name='ship'
                                        readOnly
                                        defaultValue={packet.ship} />)}
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
                                {edit && (<input
                                    type="number"
                                    className={errors.total && 'form-control is-invalid' || 'form-control is-valid'}
                                    id="total"
                                    name='total'
                                    defaultValue={packet.total}
                                    onChange={handleChange}
                                    onBlur={handleValidate} />) || (<input
                                        type="number"
                                        className='form-control'
                                        id="total"
                                        name='total'
                                        readOnly
                                        defaultValue={packet.total} />)}
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
                                {edit && (<textarea
                                className={errors.products && 'form-control is-invalid' || 'form-control is-valid'}
                                id="products-li"
                                name='products'
                                placeholder="Nombre-Cantidad
                                Nombre-Cantidad"
                                rows={8}
                                onBlur={handleValidate}></textarea>) || (<textarea
                                    className='form-control'
                                    id="products-li"
                                    name='products'
                                    readOnly
                                    placeholder="Nombre-Cantidad"
                                    rows={8}></textarea>)}
                                <div className='invalid-feedback'>{errors.products}</div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 col-lg-3">
                        {edit && (<div className="form-group row">
                            <button className='btn btn-outline-primary' onClick={saveProducts}>Aplicar</button>
                        </div>)}
                    </div>
                    {edit && (<div className='col-md-12 col-lg-12 d-flex justify-content-center mt-1'>
                            <button className='btn btn-success w-50' onClick={handleUpdate}>Actualizar</button>
                    </div>)}
                </div>
            </form>
            </div>
            <p class="d-inline-flex gap-1">
  <button class="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
    Rastrear paquete
  </button>
</p>
<div class="collapse" id="collapseExample">
  <div class="card card-body">
  <iframe frameBorder="0" height="700px" scrolling="yes" src="https://www.correosdemexico.gob.mx/SSLServicios/SeguimientoEnvio/Seguimiento.aspx" width="100%"></iframe>
  </div>
</div>
        </div>
    )
}

export default EditPackage;