import React, { useState } from 'react';
import JoblyApi from '../api';
import './UserProfile.css';

function UserProfile({ currentUser, setCurrentUser }) {
    const [formData, setFormData] = useState({
        firstName: currentUser?.firstName || '',
        lastName: currentUser?.lastName || '',
        email: currentUser?.email || ''
    });
    const [formErrors, setFormErrors] = useState([]);
    const [saveConfirmed, setSaveConfirmed] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(data => ({
            ...data,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let updatedUser = await JoblyApi.saveProfile(currentUser.username, formData);
            setFormErrors([]);
            setCurrentUser(updatedUser);
            setSaveConfirmed(true);
        } catch (errors) {
            setFormErrors(errors);
            setSaveConfirmed(false);
        }
    };

    if (!currentUser) {
        return <div>Loading...</div>;
    }

    return (
        <div className="UserProfile">
            <h2>Profile</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Username</label>
                    <p className="form-control-plaintext">{currentUser.username}</p>
                </div>
                <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>
                {formErrors.length
                    ? <div className="alert alert-danger" role="alert">
                        {formErrors.map(error => (
                            <p className="mb-0 small" key={error}>
                                {error}
                            </p>
                        ))}
                    </div>
                    : null
                }
                {saveConfirmed
                    ? <div className="alert alert-success">Updated successfully.</div>
                    : null
                }
                <button>Save Changes</button>
            </form>
        </div>
    );
}

export default UserProfile;
