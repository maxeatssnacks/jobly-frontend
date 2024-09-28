import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import JoblyApi from '../api';
import JobCard from './JobCard';
import './CompanyDetails.css';

function CompanyDetails({ applyToJob, appliedJobs, handle, name, description, logoUrl, isListItem }) {
    const params = useParams();
    const [company, setCompany] = useState(null);
    const [isLoading, setIsLoading] = useState(!isListItem);

    const getCompany = useCallback(async () => {
        if (isListItem) return;
        setIsLoading(true);
        try {
            const companyData = await JoblyApi.getCompany(params.handle);
            setCompany(companyData);
        } catch (err) {
            console.error("Error loading company details:", err);
        } finally {
            setIsLoading(false);
        }
    }, [params.handle, isListItem]);

    useEffect(() => {
        getCompany();
    }, [getCompany]);

    if (isLoading) {
        return <div className="CompanyDetails-loading">Loading...</div>;
    }

    if (isListItem) {
        return (
            <Link to={`/companies/${handle}`} className="CompanyDetails CompanyDetails-listItem">
                <div className="CompanyDetails-header">
                    <h2>{name}</h2>
                    {logoUrl && <img src={logoUrl} alt={`${name} logo`} className="CompanyDetails-logo" />}
                </div>
                <p className="CompanyDetails-description">{description}</p>
            </Link>
        );
    }

    if (!company) {
        return <div className="CompanyDetails-error">Company not found</div>;
    }

    return (
        <div className="CompanyDetails">
            <div className="CompanyDetails-header">
                <h2>{company.name}</h2>
                {company.logoUrl && <img src={company.logoUrl} alt={`${company.name} logo`} className="CompanyDetails-logo" />}
            </div>
            <p className="CompanyDetails-description">{company.description}</p>
            <h3 className="CompanyDetails-jobsTitle">Jobs at {company.name}</h3>
            <div className="CompanyDetails-jobs">
                {company.jobs.map(job => (
                    <JobCard
                        key={job.id}
                        id={job.id}
                        title={job.title}
                        salary={job.salary}
                        equity={job.equity}
                        companyName={company.name}
                        applyToJob={applyToJob}
                        hasApplied={appliedJobs.includes(job.id)}
                    />
                ))}
            </div>
        </div>
    );
}

export default React.memo(CompanyDetails);