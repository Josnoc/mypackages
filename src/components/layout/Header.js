import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
    let user = "";
    if (localStorage.getItem("token") && localStorage.getItem("token") === "josnoc.gms@gmail.com") {
        user = "SU";
    }
    const navigate = useNavigate();

    const [query, setQuery] = useState('');

    const handleChange = (e) => {
        setQuery(e.target.value)
    }

    const onLogout = () => {
        localStorage.removeItem("token");
    }

    const handleSubmit = () => {
        navigate('/edit/' + query);
    }
    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary gradient_nav">
            <div className="container-fluid">
                <a className="navbar-brand" href="#">Navbar
                </a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link to={`/`} className="nav-link active">Inicio</Link>
                            {/* <a className="nav-link active" aria-current="page" href="#">Home</a> */}
                        </li>
                        <li className="nav-item">
                            <Link to={`/products`} className="nav-link active">Productos</Link>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Acción rápida
                            </a>
                            <ul className="dropdown-menu">
                                {user === "SU" && <li><Link to={`/add`} className="nav-link active">Añadir paquete</Link></li>}
                                <li><Link to={`/create`} className="nav-link active">Hacer paquete</Link></li>
                                <li><Link to={`/addproduct`} className="nav-link active">Añadir Producto</Link></li>
                                <li><Link to={`#`} className="nav-link active" onClick={onLogout}>Salir</Link></li>
                                {/* <li><hr className="dropdown-divider"></li> */}
                            </ul>
                        </li>
                    </ul>
                    <form className="d-flex" onSubmit={handleSubmit}>
                        <input onChange={handleChange} className="form-control me-2" type="search" placeholder="Buscar paquete" aria-label="Search" />
                        <a className="btn btn-outline-success"
                            href={`/edit/${query}`}
                        >Buscar</a>
                    </form>
                </div>
            </div>
        </nav>
    );
}

export default Header;