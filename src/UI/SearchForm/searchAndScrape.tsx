import React, { useState } from 'react';
import './SearchForm.styles.scss'

type SearchResult = {
  trackId: number;
  trackName: string;
  artworkUrl60: string;
  artistName: string;
  trackViewUrl: string;
  description: string;
};

type SearchBarProps = {};

const MAX_DESCRIPTION_LENGTH = 150;

const searchAndScrapePrivacyPolicy = async (searchTerm: string): Promise<string> => {
  const response = await fetch(`https://itunes.apple.com/search?term=${searchTerm}&entity=software`);
  const data = await response.json();
  const software = data.results[0]; // Assuming we want the first result

  // Extract the website URL from the software object
  const websiteUrl = software.sellerUrl || software.artistViewUrl;

  // Fetch the website HTML
  const websiteResponse = await fetch(websiteUrl);
  if (!websiteResponse.ok) {
    throw new Error('Failed to fetch website');
  }
  const websiteHtml = await websiteResponse.text();

  // Use Cheerio to parse the HTML and extract the privacy policy text
  const cheerio = require('cheerio');
  const $ = cheerio.load(websiteHtml);
  const privacyPolicyUrl = $('a[href*="privacy"]').attr('href');
  const privacyPolicyResponse = await fetch(privacyPolicyUrl);
  if (!privacyPolicyResponse.ok) {
    throw new Error('Failed to fetch privacy policy');
  }
  const privacyPolicyHtml = await privacyPolicyResponse.text();
  const privacyPolicyText = $(privacyPolicyHtml).text();

  // Return the privacy policy text
  return privacyPolicyText;
};

// const SearchBar: React.FC<SearchBarProps> = () => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchTerm(event.target.value);
//   };

//   const truncateDescription = (description: string) => {
//     if (description.length <= MAX_DESCRIPTION_LENGTH) {
//       return description;
//     }
//     const truncated = description.substring(0, MAX_DESCRIPTION_LENGTH);
//     const lastSpaceIndex = truncated.lastIndexOf(" ");
//     return truncated.substring(0, lastSpaceIndex) + " ...";
//   };

//   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();

//     setLoading(true);
//     setError('');
    
//     try {
//       const privacyPolicyText = await searchAndScrapePrivacyPolicy(searchTerm);
//       console.log(privacyPolicyText);
//       const response = await fetch(`https://itunes.apple.com/search?term=${searchTerm}&entity=software`);
//       const data = await response.json();
      
//       if (data.results) {
//         const results: SearchResult[] = data.results.map((result: any) => ({
//           trackId: result.trackId,
//           trackName: result.trackName,
//           artworkUrl60: result.artworkUrl60,
//           artistName: result.artistName,
//           trackViewUrl: result.trackViewUrl,
//           description: result.description
//         }));
//         setSearchResults(results);
    
//         // Call the searchAndScrapePrivacyPolicy function and update the state with the privacy policy text
//         const privacyPolicyText = await searchAndScrapePrivacyPolicy(searchTerm);
//         console.log(privacyPolicyText); // You can log the privacy policy text to the console for testing purposes
//         // Update the state with the privacy policy text
//         // setPrivacyPolicyText(privacyPolicyText); // You can define the state using useState hook
//       }
//     } catch (error) {
//       console.error(error);
//       setError('An error occurred. Please try again later.');
//     } finally {
//       setLoading(false);
//     }
// }

// const SearchBar: React.FC<SearchBarProps> = React.memo(() => {
//     const [searchTerm, setSearchTerm] = useState('');
//     const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState('');
    
//     const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchTerm(event.target.value);
//     };
    
//     const truncateDescription = (description: string) => {
//     if (description.length <= MAX_DESCRIPTION_LENGTH) {
//     return description;
//     }
//     const truncated = description.substring(0, MAX_DESCRIPTION_LENGTH);
//     const lastSpaceIndex = truncated.lastIndexOf(" ");
//     return truncated.substring(0, lastSpaceIndex) + " ...";
//     };
    
//     const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
    
//     setLoading(true);
//     setError('');
    
//     try {
//              // Call the searchAndScrapePrivacyPolicy function and update the state with the privacy policy text
//              const privacyPolicyText = await searchAndScrapePrivacyPolicy(searchTerm);
//              console.log(privacyPolicyText); // You can log the privacy policy text to the console for testing purposes
//              // Update the state with the privacy policy text
//              // setPrivacyPolicyText(privacyPolicyText); // You can define the state using useState hook
//       const response = await fetch(`https://itunes.apple.com/search?term=${searchTerm}&entity=software`);
//       const data = await response.json();
      
//       if (data.results) {
//         const results: SearchResult[] = data.results.map((result: any) => ({
//           trackId: result.trackId,
//           trackName: result.trackName,
//           artworkUrl60: result.artworkUrl60,
//           artistName: result.artistName,
//           trackViewUrl: result.trackViewUrl,
//           description: result.description
//         }));
//         setSearchResults(results);
    
//       }
//     } catch (error) {
//       console.error(error);
//       setError('An error occurred. Please try again later.');
//     } finally {
//       setLoading(false);
//     }
//     };
    
//     return (
//     <div className="search-bar">
//     <form onSubmit={handleSubmit}>
//     <label htmlFor="search-input">Search for an app:</label>
//     <input
//            type="text"
//            id="search-input"
//            value={searchTerm}
//            onChange={handleInputChange}
//            placeholder="Enter app name"
//          />
//     <button type="submit">Search</button>
//     </form>
//     {loading && <p>Loading...</p>}
//     {error && <p>{error}</p>}
//     {searchResults.length > 0 && (
//     <ul>
//     {searchResults.map((result) => (
//     <li key={result.trackId}>
//     <img src={result.artworkUrl60} alt={result.trackName} />
//     <div>
//     <a href={result.trackViewUrl}>{result.trackName}</a> by {result.artistName}
//     <p>{truncateDescription(result.description)}</p>
//     </div>
//     </li>
//     ))}
//     </ul>
//     )}
//     </div>
//     );
//     });
    