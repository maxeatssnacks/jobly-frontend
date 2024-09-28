import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Layout.css';

function LoginForm({ login }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [formErrors, setFormErrors] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(data => ({
            ...data,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormErrors([]);
        try {
            const result = await login(formData);
            if (result.success) {
                navigate('/');
            } else {
                setFormErrors(result.errors);
            }
        } catch (err) {
            setFormErrors(err);
        }
    };

    return (
        <div className="Form-container">
            <form onSubmit={handleSubmit} className="Form">
                <h2>Log In</h2>
                {formErrors.length
                    ? <div className="alert alert-danger">{formErrors}</div>
                    : null}
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Log In</button>
            </form>
        </div>
    );
}

export default LoginForm;