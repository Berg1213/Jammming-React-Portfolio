import './App.css'
import PopularContent from "./components/PopularContent";
import Playlist from "./components/Playlist";
import SearchBar from "./components/SearchBar";
import SearchResults from "./components/SearchResults";
import Track from "./components/Track";

import OAuthTestHarness from "./tests/SpotifyOAuthTest";
import SpotifyAPITestHarness from "./tests/SpotifyAPITest";

import { useState,useEffect } from "react";

import { 
  getTopArtists,getTopTracks, searchTracks, searchArtists,
  searchAlbumsByTag, searchArtistsByTag, searchTracksByTag, 
  filterAndSortByRelevance, filterPopularContent 
} from "./utils/LastFMAPI";

function App() {
  const testing = true;
  console.log("App component loading, testing mood:", testing);
  console.log("current url:", window.location.href);

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [popularData, setPopularData] = useState(null);
  const [searchSuggestions, setSearchSuggestions] = useState([]);

  const [popularLoading, setPopularLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(true);

  const handleSearch = (e, suggestion) => {
    e.preventDefault();
    let query;
    if (suggestion) {
      query = suggestion.name;
    }  else {
      query = searchTerm;
    }

    const fetchSearchResults = async () => {
      setSearchLoading(true);
      const thresholds = { artists: 2 , tracks: 2};
      const {filteredArtists, filteredTracks} = filterPopularContent(popularData, query, thresholds);
      const albumTags = await searchAlbumsByTag(query);
      
      let finalArtistResults;
      let finalTrackResults;
      
      if (filteredArtists.length < thresholds.artists) {
          const apiArtists = await searchArtists(query);
          finalArtistResults = [...filteredArtists, ...apiArtists]
      } else {
        finalArtistResults = filteredArtists;
      }

      if (filteredTracks.length < thresholds.tracks) {
        const apiTracks = await searchTracks(query);
        finalTrackResults = [...filteredTracks, ...apiTracks]
      } else {
        finalTrackResults = filteredTracks;
      }

      const sortedArtistResults = filterAndSortByRelevance(finalArtistResults, query);
      const sortedTrackResults = filterAndSortByRelevance(finalTrackResults, query);

      setSearchResults({ artists: sortedArtistResults, tracks: sortedTrackResults, albumTags: albumTags});
      setSearchLoading(false);
      setSearchTerm('');
    };

    fetchSearchResults();
  };

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
    if (searchTerm.length <= 2) {
      setSearchSuggestions([]);
      return;
    }
    const fetchSuggestions = setTimeout(async () => {
      console.log('popularData:', popularData);
      console.log('popularData.artists length:', popularData.artists?.length);
      console.log('First few artist names:', popularData.artists?.slice(0, 5).map(a => a.name));
      console.log('Full artist list:', popularData.artists.map(artist => artist.name));

      const thresholds = { artists: 2 , tracks: 2};
        
      if (searchTerm.length > 2 && popularData?.artists && popularData?.tracks) {
        const { filteredArtists, filteredTracks } = filterPopularContent(popularData, searchTerm, thresholds);

        let finalArtistSuggestions;
        let finalTrackSuggestions;
        
        if (filteredArtists.length < thresholds.artists) {
           const apiArtists = await searchArtists(searchTerm);
           finalArtistSuggestions = [...filteredArtists, ...apiArtists]
        } else {
          finalArtistSuggestions = filteredArtists;
        }

        if (filteredTracks.length < thresholds.tracks) {
          const apiTracks = await searchTracks(searchTerm);
          finalTrackSuggestions = [...filteredTracks, ...apiTracks]
        } else {
          finalTrackSuggestions = filteredTracks;
        }
        const suggestions = [...finalArtistSuggestions.slice(0, 3), ...finalTrackSuggestions.slice(0, 5)];

        setSearchSuggestions(suggestions);
      }
    }, 300);

    return () => clearTimeout(fetchSuggestions);
  }, [searchTerm, popularData]);

  if (testing) {
    console.log('rendering test harness')
    return (
      <div>
        <h1>Testing Mode Active</h1>
        <p>currentUrl: {window.location.href}</p>
        <OAuthTestHarness />
        <SpotifyAPITestHarness />
      </div>
    )
  } else {
      return (
        <div>
          <SearchBar 
            handleSearch={handleSearch} 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm}
            suggestions= {searchSuggestions}/>
          {searchResults ? (
            <SearchResults 
              data={searchResults} 
              loading={searchLoading} 
              searchTerm={searchTerm}/>
          ) : (
            <PopularContent 
              artists={popularData?.artists} 
              tracks={popularData?.tracks} 
              loading={popularLoading}
            />
          )}
        </div>
    );
  };


}
export default App
