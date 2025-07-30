import './App.css'
import PopularContent from "./components/PopularContent";
import Playlist from "./components/Playlist";
import SearchBar from "./components/SearchBar";
import SearchResults from "./components/SearchResults";
import Track from "./components/Track";

import { useState,useEffect } from "react";

import { getTopArtists,getTopTracks } from "./utils/LastFMAPI";

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [popularData, setPopularData] = useState(null);

  const [popularLoading, setPopularLoading] = useState(true);
  //const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    const fetchPopularData = async () => {
      const [artists, tracks] = await Promise.all([
        getTopArtists(), getTopTracks()
      ]);
      setPopularData({ artists, tracks});
    };

    fetchPopularData();
  }, []);

  return (
    <div>
      <SearchBar onSearch={handleSearch} />
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
