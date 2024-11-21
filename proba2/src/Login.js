import React, { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import Validation from './LoginValidation';

function Login() {
    const [values, setValues] = useState({
        email: "",
        password: "",
    })
    const navigate = useNavigate();

    const [errors, setErrors] = useState({})
    const handleInput = (event) =>{
        setValues(prev => ({...prev, [event.target.name]: event.target.value}))
    }
    const handleSubmit=(event)=>{
        event.preventDefault();
        setErrors(Validation(values));
        if(errors.email === "" && errors.password === ""){
            console.log("Sending login data:", values);
            axios.post('http://localhost:8081/login', values)
            .then(res => {
                console.log(res.data)
                if(res.data.Login) {
                    localStorage.setItem("token", res.data.token)
                    navigate('/home');
                }
                else if(res.data === "Failure") {
                    alert("chujj");
                    }
                else{
                    alert("No record existed");
                    
                }
            })
            .catch(err => console.log(err));
        }
    }

    return (
        <div className='d-flex justify-content-center align-items-center bg-primary vh-100'>
            <div className='bg-white p-3 rounded w-25'>
                <h2>Sign in</h2>
                <form action="" onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label htmlFor='email'>Email </label>
                        <input type='email' placehloder='Enter Email' name='email'
                        onChange={handleInput} className='form-control rounded-0'/>
                        {errors.email && <span className='text-danger'> {errors.email}</span>}
                    </div>
                    <div className='mb-3'>
                        <label htmlFor='password'>Password </label>
                        <input type='password' placeholder='Enter Password'  name='password'
                        onChange={handleInput}
                        className='form-control rounded-0'/>
                        {errors.password && <span className='text-danger'> {errors.password}</span>}
                    </div>
                    <button type='submit' className='btn btn-success w-100'>Log in</button>
                    <p> </p>
                    <Link to='/signup' className='btn btn-default border w-100 bg-light text-decoration-none'>Register</Link>
                    <p> </p>
                    <Link to='/forgotPassword' className='w-100 text-decoration-underline text-primary'> Forgot Password?</Link>
                    
                    
                </form>
            </div>
        </div>
    )
}

export default Login

