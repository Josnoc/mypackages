import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LiProduct from './LiProduct';
// FG4MR-XMXHH-K6R63-2Y7GY-9RF7Z
// import { ref, push } from 'firebase/database';
// import { database } from '../../config/firebase';

const Uno = () => {
    const [newBox, setNewBox] = useState({
        no: '123456yh',
        date: '11/11/11',
        by: 'Mex',
        price: 2100,
        total: 4100,
        products: []
    });
    const [products, setproducts] = useState([]);
    const [actualId, setActualId] = useState(0);

    const handleChange = (e) => {
        console.log(newBox);
        setNewBox({
            ...newBox,
            ['products']: products
        });
    }

    const handleSave = async (e) => {
        e.preventDefault();
        console.log(newBox);
        // push(ref(database, 'Boxes'), newBox)
        // .then(response => {
        //   console.log(response);
        // })
        // .catch(error => {
        //   console.log(error);
        // })
    }

    const handleChangeInput = (e) => {
        e.preventDefault();
        // setNewBox({
        //         ...products, 
        //         [e.target.name]: e.target.value
        //       })
        console.log(products);
    }

    const renderLi = () => {
        let prods = document.getElementById("products-li").value;
        let prod = prods.split(/\n/);
        let producto = [];
        prod.forEach((prod, index) => {
            let properties = prod.split("-");
            producto.push({
                name: properties[0],
                quantity: parseInt(properties[1])
            })
        });
        setproducts(producto);

        setNewBox({
            ...newBox,
            ['products']: products
        });
    }

    const getNumber = (e) => {
        e.preventDefault();
        setActualId(e.target.value)
    }
    const currentDate = () => { let dat = new Date(); return `${dat.getDate()}-${dat.getMonth() + 1}-${dat.getFullYear()}`; }

    return (
        <div className='d-flex justify-content-center mt-5'>
            <button className='btn btn-primary' onClick={handleChange}>Combinar</button>
            <button className='btn btn-primary' onClick={handleSave}>Show</button>
            <div className='w-100'>
                <ul id='lis' className='border border-primary'></ul>
            </div>
            <input type='number' onChange={getNumber} />
            <button className='btn btn-primary' onClick={renderLi}>Aply</button>
            <textarea rows={10} id='products-li'></textarea>
        </div>
    )
}

export default Uno;