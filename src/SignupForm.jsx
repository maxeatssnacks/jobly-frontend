import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Layout.css';

function SignupForm({ signup }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        firstName: '',
        lastName: '',
        email: ''
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
            const result = await signup(formData);
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
                <h2>Sign Up</h2>
                {formErrors.length > 0 && (
                    <div className="alert alert-danger">
                        {formErrors.map((error, index) => (
                            <p key={index}>{error}</p>
                        ))}
                    </div>
                )}
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
                <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Sign Up</button>
            </form>
        </div>
    );
}

export default SignupForm;