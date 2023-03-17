import React, { useState } from 'react';
import './SearchBar.styles.scss';

type SearchBarProps = {
  onSearch: (searchTerm: string) => void;
};

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <div className='SearchBar'>
        <form onSubmit={handleSubmit}>
        <input type="text" value={searchTerm} onChange={handleInputChange} />
        <button type="submit">Search</button>
        </form>
    </div>
  );
};

export default SearchBar;
