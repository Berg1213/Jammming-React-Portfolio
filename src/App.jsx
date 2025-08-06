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
        console.log('popularData:', popularData);
        console.log('popularData.artists length:', popularData.artists?.length);
        console.log('First few artist names:', popularData.artists?.slice(0, 5).map(a => a.name));
        console.log('Full artist list:', popularData.artists.map(artist => artist.name));       

      if (searchTerm.length > 2 && popularData?.artists && popularData?.tracks) {
        const filteredArtists = popularData.artists.filter(artist => 
          artist.name.toLowerCase().includes(searchTerm.toLowerCase()));
        const filteredTracks = popularData.tracks.filter(track => 
          track.name.toLowerCase().includes(searchTerm.toLowerCase()));

        let finalArtists;
        let finalTracks;
        
        if (filteredArtists.length < 0) {
          finalArtists = await searchArtists(searchTerm);
        } else {
          finalArtists = filteredArtists;
        }

        if (filteredTracks.length < 0) {
          finalTracks = await searchTracks(searchTerm);
        } else {
          finalTracks = filteredTracks;
        }
        const suggestions = [...finalArtists.slice(0, 3), ...finalTracks.slice(0, 5)];

        setSearchSuggestions(suggestions);
      }
    }, 300);

    return () => clearTimeout(fetchSuggestions);
  }, [searchTerm, popularData]);

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
