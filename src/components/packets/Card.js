import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Card = (data) => {
    // let user = "";
    // if (localStorage.getItem("token") && localStorage.getItem("token") === "josnoc.gms@gmail.com") {
    //     user = "SU";
    // }
    let boxData = data.data, list ={}, listU = "";
    // console.log(boxData);
    return (
        <div>
            <Link to={`/edit/${boxData.no}`} className='text-decoration-none'>
            {/* <a data-bs-toggle="modal" data-bs-target="#exampleModal"> */}
            <div className="card border-secondary mb-3 m-1">
                <div className="card-header">{boxData.no}</div>
                <div className="card-body text-secondary">
                    <h5 className="card-title">{boxData.date}</h5>
                    <p className="card-text">{boxData.by}.</p>
                </div>
                <div className="card-footer">
                
                    {/* <div className='w-100'><p className='m-0'>Envío: {boxData.ship}</p></div>
                    <div className='w-100'><p>Total: {boxData.total}</p></div> */}
                </div>
            </div>
            {/* </a> */}
            </Link>
        </div>
    )
}

export default Card;