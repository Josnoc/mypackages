import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { auth } from '../../config/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Swal from 'sweetalert2';

const Login =(props) => {
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
    // const response = 
    await signInWithEmailAndPassword(auth, user.email, user.password)
    .then(response => {
      // console.log(response);
    localStorage.setItem("token", user.email);
    navigate('/');
      // this.history.push(null, '/');
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
    <div className='d-flex justify-content-center align-items-center' style={{height: 'auto', minHeight: '500px'}}>
        
            <div className='card w-25'>
                <div className='row'><h1>Login</h1></div>
                <div className='container'>
                <form onSubmit={handelLogin}>
                    <div className="mb-3">
                        <label htmlFor="exampleFormControlInput1" className="form-label">Email address</label>
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
                    <label htmlFor="inputPassword5" className="form-label">Password</label>
                    <input 
                    type="password" 
                    className="form-control" 
                    aria-labelledby="passwordHelpBlock"name="password"
                    label="Password"
                    id="password"
                    autoComplete="current-password"
                    defaultValue={user.password}
                    onChange={handleChange} />
                    <div id="passwordHelpBlock" className="form-text">
                    Your password must be 8-20 characters long, contain letters and numbers, and must not contain spaces, special characters, or emoji.
                    </div>
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