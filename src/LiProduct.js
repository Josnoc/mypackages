import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// import { ref, push } from 'firebase/database';
// import { database } from '../../config/firebase';

const LiProduct = ({ id, handleChangeInput }) => {

    return (
        <li >
            <input name={id} 
                type="text"
                className="form-control"
                id={id}
                onChange={handleChangeInput} ></input>
        </li>
    )
}

export default LiProduct;