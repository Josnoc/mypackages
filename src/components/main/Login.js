import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../config/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Swal from 'sweetalert2';

const Login = (props) => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: '',
    password: '',
  });

  const [errorForm, setErrorForm] = useState('');

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    })
  }

  const handelLogin = async (e) => {
    e.preventDefault();
    setErrorForm('');
    await signInWithEmailAndPassword(auth, user.email, user.password)
      .then(response => {
        localStorage.setItem("token", user.email);
        navigate('/');
      })
      .catch(error => {
        if (error.message === 'Firebase: Error (auth/invalid-email).') {
          Swal.fire({
            title: 'Error!',
            text: 'Correo inválido',
            timer: 3000,
            showConfirmButton: false,
            icon: 'error',
            confirmButtonText: 'Cool'
          })
        } else if (error.message === 'Firebase: Error (auth/wrong-password).') {
          Swal.fire({
            title: 'Error!',
            text: 'Contraseña inválida',
            timer: 3000,
            showConfirmButton: false,
            icon: 'error',
            confirmButtonText: 'Cool'
          })
        } else if (error.message === 'Firebase: Error (auth/missing-password).') {
          Swal.fire({
            title: 'Error!',
            text: 'Introduce ambos datos',
            timer: 3000,
            showConfirmButton: false,
            icon: 'error',
            confirmButtonText: 'Cool',

          })
        } else if (error.message === 'Firebase: Error (auth/user-not-found).') {
          Swal.fire({
            title: 'Error!',
            text: 'Usuario inválido',
            timer: 3000,
            showConfirmButton: false,
            icon: 'error',
            confirmButtonText: 'Cool'
          })
        }
        setErrorForm(error.message)
      })
  }

  return (
    <div className='d-flex justify-content-center row-cols-lg-3 row-cols-md-3 row-cols-sm-1 m-2 align-items-center' style={{ height: '1rem', minHeight: '500px' }}>

      <div className='card p-3'>
        <div className='row'><h1>Ingresar</h1></div>
        <div className='container'>
          <form onSubmit={handelLogin}>
            <div className="mb-3">
              <label htmlFor="exampleFormControlInput1" className="form-label">Correo</label>
              <input
                type="email"
                className="form-control"
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                placeholder="name@example.com"
                defaultValue={user.email}
                onChange={handleChange} />
            </div>
            <label htmlFor="inputPassword5" className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              name="password"
              placeholder='**********'
              label="Password"
              id="password"
              autoComplete="current-password"
              defaultValue={user.password}
              onChange={handleChange} />
            <div>
              <button className='btn btn-primary' type="submit">Login</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;