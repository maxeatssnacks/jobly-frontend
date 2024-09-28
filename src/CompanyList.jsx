import React, { useState, useEffect, useMemo, useCallback } from 'react';
import JoblyApi from '../api';
import SearchBar from './SearchBar';
import CompanyDetails from './CompanyDetails';
import './CompanyList.css';

function CompanyList() {
    const [companies, setCompanies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchCompanies() {
            setIsLoading(true);
            try {
                const companiesData = await JoblyApi.getCompanies();
                setCompanies(companiesData);
            } catch (err) {
                console.error("An error occurred fetching companies:", err);
            } finally {
                setIsLoading(false);
            }
        }
        fetchCompanies();
    }, []);

    const filteredCompanies = useMemo(() => {
        return companies.filter(company =>
            company.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [companies, searchTerm]);

    const handleSearch = useCallback((term) => {
        setSearchTerm(term);
    }, []);

    if (isLoading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="CompanyList">
            <SearchBar onSearch={handleSearch} />
            {filteredCompanies.length ? (
                <div className="CompanyList-list">
                    {filteredCompanies.map(company => (
                        <CompanyDetails
                            key={company.handle}
                            handle={company.handle}
                            name={company.name}
                            description={company.description}
                            logoUrl={company.logoUrl}
                            isListItem={true}
                        />
                    ))}
                </div>
            ) : (
                <p className="lead">Sorry, no results were found!</p>
            )}
        </div>
    );
}

export default React.memo(CompanyList);