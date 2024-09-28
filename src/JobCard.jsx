import React from 'react';
import './JobCard.css';

function JobCard({ id, title, salary, equity, companyName, applyToJob, unapplyFromJob, hasApplied }) {
    const handleApply = () => {
        if (!hasApplied) {
            applyToJob(id);
        }
    };

    return (
        <div className="JobCard">
            <h3 className="JobCard-title">{title}</h3>
            <p className="JobCard-company">{companyName}</p>
            <div className="JobCard-details">
                {salary && <div>Salary: ${salary.toLocaleString()}</div>}
                {equity !== undefined && <div>Equity: {equity}</div>}
            </div>
            <button
                onClick={handleApply}
                className={`JobCard-button ${hasApplied ? "applied" : ""}`}
                disabled={hasApplied}
            >
                {hasApplied ? "Applied" : "Apply"}
            </button>
        </div>
    );
}

export default React.memo(JobCard);