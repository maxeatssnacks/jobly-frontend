import React, { useState, useCallback } from 'react';
import { debounce } from 'lodash'; // Make sure to install lodash
import './SearchBar.css';

function SearchBar({ onSearch }) {
    const [searchTerm, setSearchTerm] = useState('');

    const debouncedSearch = useCallback(
        debounce((term) => {
            onSearch(term);
        }, 300),
        [onSearch]
    );

    const handleChange = (e) => {
        setSearchTerm(e.target.value);
        debouncedSearch(e.target.value);
    };

    return (
        <div className="SearchBar-container">
            <div className="SearchBar">
                <input
                    type="text"
                    placeholder="Enter job title..."
                    value={searchTerm}
                    onChange={handleChange}
                />
            </div>
        </div>
    );
}

export default React.memo(SearchBar);
