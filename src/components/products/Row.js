import React, { useState } from 'react';

const Row = ({ id, name, price, quantity, onEdit }) => {
  let user = false;
  if (localStorage.getItem("token") && localStorage.getItem("token") === "josnoc.gms@gmail.com") {
    user = true;
  }
  return (
    <tr>
      <td>{name}</td>
      <td>{price}</td>
      <td>{quantity > 0 && quantity || "No hay"}</td>
      {user && (<td><button type="button" onClick={() => { onEdit(id); }} className="btn btn-outline-info" data-bs-toggle="modal" data-bs-target="#editProductModal">Editar</button></td>)}
    </tr>
  )
}

export default Row;