const Input = ({ name, quantity, addProduct }) => {
    return (
        <div className="input-group">
            <span className="input-group-text w-50">{name}</span>
            <input type="number" max={quantity} min={0} className="form-control" placeholder="Cantidad" aria-label="Input cantidad de productos" />
            <button className="btn btn-outline-secondary" type="button" onClick={() => { addProduct(name, quantity) }}>Agregar</button>
        </div>
    )
}

export default Input;