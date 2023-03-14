import React, { useState } from 'react';
import './SearchForm.styles.scss'

type SearchResult = {
  trackId: number;
  trackName: string;
  artworkUrl60: string;
  artistName: string;
  trackViewUrl: string;
  description: string
};

const MAX_DESCRIPTION_LENGTH = 150;

const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const truncateDescription = (description: string) => {
    if (description.length <= MAX_DESCRIPTION_LENGTH) {
      return description;
    }
    const truncated = description.substring(0, MAX_DESCRIPTION_LENGTH);
    const lastSpaceIndex = truncated.lastIndexOf(" ");
    return truncated.substring(0, lastSpaceIndex) + " ...";
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const response = await fetch(`https://itunes.apple.com/search?term=${searchTerm}&entity=software`);
    const data = await response.json();

    if (data.results) {
        console.log(data.results)
      const results: SearchResult[] = data.results.map((result: any) => ({
        trackId: result.trackId,
        trackName: result.trackName,
        artworkUrl60: result.artworkUrl60,
        artistName: result.artistName,
        trackViewUrl: result.trackViewUrl,
        description: result.description
      }));
      setSearchResults(results);
    }
  };

  return (
    <div className='search-bar'>
      <form onSubmit={handleSubmit}>
        <input type="text" value={searchTerm} onChange={handleInputChange} />
        <button type="submit">Search</button>
      </form>
      <ul>
        {searchResults.map((result) => (
          <li key={result.trackId}>
            <img src={result.artworkUrl60} alt={result.trackName} />
            <div>
              <h3>{result.trackName}</h3>
              <p>{result.artistName}</p>
              <p>{truncateDescription(result.description)}{" "}</p>
              <a href={result.trackViewUrl} target="_blank" rel="noopener noreferrer">View on App Store</a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchBar;
