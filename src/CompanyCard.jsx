import React from 'react';
import { Link } from 'react-router-dom';
import './CompanyDetails.css';

function CompanyCard({ handle, name, description, logoUrl }) {
    return (
        <Link to={`/companies/${handle}`} className="Card CompanyCard">
            <h3>{name}</h3>
            <p>{description}</p>
            {logoUrl && <img src={logoUrl} alt={`${name} logo`} className="company-logo" />}
        </Link>
    );
}

export default CompanyCard;