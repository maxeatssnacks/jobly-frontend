import React from 'react';
import { Link } from 'react-router-dom';
import './Homepage.css';

function Homepage({ currentUser }) {
    return (
        <div className="Homepage">
            <h1>Jobly</h1>
            <p>All the jobs in one, convenient place.</p>
            {currentUser ? (
                <h2>Welcome Back, {currentUser.firstName || currentUser.username}!</h2>
            ) : (
                <div className="Homepage-buttons">
                    <Link to="/login" className="btn btn-primary">Log in</Link>
                    <Link to="/signup" className="btn btn-primary">Sign up</Link>
                </div>
            )}
        </div>
    );
}

export default Homepage;