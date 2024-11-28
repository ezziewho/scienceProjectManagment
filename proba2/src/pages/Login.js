import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Validation from '../components/LoginValidation';

function Login() {
    const [values, setValues] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:8081/user/checkauth')
            .then(res => {
                if (res.data.valid) {
                    navigate('/home');
                }
            })
            .catch(err => console.error("Authentication check failed:", err));
    }, [navigate]);

    const handleInput = (event) => {
        setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const validationErrors = Validation(values);
        setErrors(validationErrors);

        if (!validationErrors.email && !validationErrors.password) {
            setLoading(true);
            axios.post('http://localhost:8081/auth/login', values)
                .then(res => {
                    if (res.data.Login) {
                        navigate('/home');
                    } else if (res.data === "Failure") {
                        setServerError("Invalid email or password.");
                    } else {
                        setServerError("No user found.");
                    }
                })
                .catch(err => setServerError("An error occurred. Please try again."))
                .finally(() => setLoading(false));
        }
    };

    return (
        <div className='d-flex justify-content-center align-items-center bg-primary vh-100'>
            <div className='bg-white p-3 rounded w-25'>
                <h2>Sign in</h2>
                <form onSubmit={handleSubmit}>
                    {serverError && <div className='text-danger mb-3'>{serverError}</div>}
                    <div className='mb-3'>
                        <label htmlFor='email'>Email</label>
                        <input
                            type='email'
                            placeholder='Enter Email'
                            name='email'
                            onChange={handleInput}
                            className='form-control rounded-0'
                        />
                        {errors.email && <span className='text-danger'>{errors.email}</span>}
                    </div>
                    <div className='mb-3'>
                        <label htmlFor='password'>Password</label>
                        <input
                            type='password'
                            placeholder='Enter Password'
                            name='password'
                            onChange={handleInput}
                            className='form-control rounded-0'
                        />
                        {errors.password && <span className='text-danger'>{errors.password}</span>}
                    </div>
                    <button type='submit' className='btn btn-success w-100' disabled={loading}>
                        {loading ? 'Logging in...' : 'Log in'}
                    </button>
                    <p></p>
                    <Link to='/signup' className='btn btn-default border w-100 bg-light text-decoration-none'>Register</Link>
                    <p></p>
                    <Link to='/forgotPassword' className='w-100 text-decoration-underline text-primary'>Forgot Password?</Link>
                </form>
            </div>
        </div>
    );
}

export default Login;
