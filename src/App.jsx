import './App.css'
import PopularContent from "./components/PopularContent";
import Playlist from "./components/Playlist";
import SearchBar from "./components/SearchBar";
import SearchResults from "./components/SearchResults";
import Track from "./components/Track";

import { useState,useEffect } from "react";

import { getTopArtists,getTopTracks, searchTracks, searchArtists } from "./utils/LastFMAPI";

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [popularData, setPopularData] = useState(null);
  const [searchSuggestions, setSearchSuggestions] = useState([]);

  const [popularLoading, setPopularLoading] = useState(true);

  useEffect(() => {
    const fetchPopularData = async () => {
      setPopularLoading(true);
      const [artists, tracks] = await Promise.all([
        getTopArtists(), getTopTracks()
      ]);
      setPopularData({ artists, tracks});
      setPopularLoading(false);
    };

    fetchPopularData();
  }, []);

  useEffect(() => {
    const fetchSuggestions = setTimeout(async () => {
      if (searchTerm.length > 2) {
        const [tracks, artists] = await Promise.all([
          searchTracks(searchTerm), searchArtists(searchTerm)
        ])

        const suggestions = [...artists.slice(0, 3), ...tracks.slice(0, 5)];

        setSearchSuggestions(suggestions);
      }
    }, 300);

    return () => clearTimeout(fetchSuggestions);
  }, [searchTerm]);

  return (
    <div>
      <SearchBar 
        /* onSearch={handleSearch} */ 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm}
        suggestions= {searchSuggestions}/>
      {searchResults ? (
        <SearchResults data={searchResults} />
      ) : (
        <PopularContent 
          artists={popularData?.artists} 
          tracks={popularData?.tracks} 
          loading={popularLoading}
        />
      )}
    </div>
  );
}
export default App
