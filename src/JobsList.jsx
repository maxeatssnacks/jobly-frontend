import React, { useState, useEffect, useMemo, useCallback } from 'react';
import JobCard from './JobCard';
import JoblyApi from '../api';
import SearchBar from './SearchBar';
import './JobsList.css';

function JobsList({ applyToJob, unapplyFromJob, appliedJobs }) {
    const [jobs, setJobs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchJobs() {
            setIsLoading(true);
            try {
                const jobsData = await JoblyApi.getJobs();
                setJobs(jobsData);
            } catch (err) {
                console.error("An error occurred fetching jobs:", err);
                setJobs([]);
            } finally {
                setIsLoading(false);
            }
        }
        fetchJobs();
    }, []);

    const filteredJobs = useMemo(() => {
        return jobs.filter(job =>
            job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.companyName.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [jobs, searchTerm]);

    const handleSearch = useCallback((term) => {
        setSearchTerm(term);
    }, []);

    if (isLoading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="JobsList">
            <SearchBar onSearch={handleSearch} />
            {filteredJobs.length ? (
                <div className="JobsList-list">
                    {filteredJobs.map(job => (
                        <JobCard
                            key={job.id}
                            id={job.id}
                            title={job.title}
                            salary={job.salary}
                            equity={job.equity}
                            companyName={job.companyName}
                            applyToJob={applyToJob}
                            unapplyFromJob={unapplyFromJob}
                            hasApplied={appliedJobs.includes(job.id)}
                        />
                    ))}
                </div>
            ) : (
                <p className="lead">Sorry, no results were found!</p>
            )}
        </div>
    );
}

export default React.memo(JobsList);