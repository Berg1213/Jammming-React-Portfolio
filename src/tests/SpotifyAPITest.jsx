import { useState } from 'react';
import { 
  searchTracks, 
  searchArtists, 
  searchAlbums,
  getCurrentUser, 
  getUserPlaylists, 
  createPlaylist,
  addTracksToPlaylist,
  getFeaturedPlaylists,
  getTopTracks,
  getTopArtists
} from '../utils/SpotifyAPI.js';
import { isAuthenticated } from '../utils/spotifyOAuth.js';

const SpotifyAPITestHarness = () => {
  const [results, setResults] = useState(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('Taylor Swift');

  // Clear any previous results/errors
  const clearResults = () => {
    setResults(null);
    setError('');
    setStatus('');
  };

  // Helper to show limited results in UI, full results in console
  const displayResults = (data, type, fullData = null) => {
    const displayData = Array.isArray(data) ? data.slice(0, 3) : data;
    setResults({ type, displayData, totalCount: Array.isArray(data) ? data.length : 1 });
    console.log(`Full ${type} results:`, fullData || data);
  };

  // ====================================
  // Search Function Tests
  // ====================================

  const testSearchTracks = async () => {
    clearResults();
    try {
      setStatus(`Searching for tracks: "${searchQuery}"...`);
      const tracks = await searchTracks(searchQuery);
      displayResults(tracks, 'tracks');
      setStatus(`Found ${tracks.length} tracks`);
    } catch (err) {
      setError(`Search tracks failed: ${err.message}`);
    }
  };

  const testSearchArtists = async () => {
    clearResults();
    try {
      setStatus(`Searching for artists: "${searchQuery}"...`);
      const artists = await searchArtists(searchQuery);
      displayResults(artists, 'artists');
      setStatus(`Found ${artists.length} artists`);
    } catch (err) {
      setError(`Search artists failed: ${err.message}`);
    }
  };

  const testSearchAlbums = async () => {
    clearResults();
    try {
      setStatus(`Searching for albums: "${searchQuery}"...`);
      const albums = await searchAlbums(searchQuery);
      displayResults(albums, 'albums');
      setStatus(`Found ${albums.length} albums`);
    } catch (err) {
      setError(`Search albums failed: ${err.message}`);
    }
  };

  const testSearchAll = async () => {
    clearResults();
    try {
      setStatus(`Searching all types for: "${searchQuery}"...`);
      const [tracks, artists, albums] = await Promise.all([
        searchTracks(searchQuery),
        searchArtists(searchQuery),
        searchAlbums(searchQuery)
      ]);
      
      const combinedResults = {
        tracks: tracks.slice(0, 2),
        artists: artists.slice(0, 2),
        albums: albums.slice(0, 2),
        totals: {
          tracks: tracks.length,
          artists: artists.length,
          albums: albums.length
        }
      };
      
      setResults({ type: 'combined_search', displayData: combinedResults });
      setStatus(`Search complete: ${tracks.length} tracks, ${artists.length} artists, ${albums.length} albums`);
      
      console.log('Full combined search results:', { tracks, artists, albums });
    } catch (err) {
      setError(`Combined search failed: ${err.message}`);
    }
  };

  // ====================================
  // User Data Function Tests
  // ====================================

  const testGetUser = async () => {
    clearResults();
    try {
      setStatus('Getting current user profile...');
      const user = await getCurrentUser();
      setResults({ type: 'user', displayData: user });
      setStatus('User profile retrieved successfully');
      console.log('Full user data:', user);
    } catch (err) {
      setError(`Get user failed: ${err.message}`);
    }
  };

  const testGetPlaylists = async () => {
    clearResults();
    try {
      setStatus('Getting user playlists...');
      const playlists = await getUserPlaylists();
      displayResults(playlists, 'playlists');
      setStatus(`Found ${playlists.length} playlists`);
    } catch (err) {
      setError(`Get playlists failed: ${err.message}`);
    }
  };

  const testGetTopTracks = async () => {
    clearResults();
    try {
      setStatus('Getting user\'s top tracks...');
      const topTracks = await getTopTracks();
      displayResults(topTracks, 'top_tracks');
      setStatus(`Found ${topTracks.length} top tracks`);
    } catch (err) {
      setError(`Get top tracks failed: ${err.message}`);
    }
  };

  const testGetTopArtists = async () => {
    clearResults();
    try {
      setStatus('Getting user\'s top artists...');
      const topArtists = await getTopArtists();
      displayResults(topArtists, 'top_artists');
      setStatus(`Found ${topArtists.length} top artists`);
    } catch (err) {
      setError(`Get top artists failed: ${err.message}`);
    }
  };

  const testGetFeaturedPlaylists = async () => {
    clearResults();
    try {
      setStatus('Getting featured playlists...');
      const featured = await getFeaturedPlaylists();
      displayResults(featured, 'featured_playlists');
      setStatus(`Found ${featured.length} featured playlists`);
    } catch (err) {
      setError(`Get featured playlists failed: ${err.message}`);
    }
  };

  // ====================================
  // Playlist Management Tests
  // ====================================

  const testCreatePlaylist = async () => {
    clearResults();
    try {
      setStatus('Creating test playlist...');
      const timestamp = new Date().toLocaleTimeString();
      const playlist = await createPlaylist(
        `Test Playlist ${timestamp}`, 
        'Created by API test harness for testing purposes'
      );
      setResults({ type: 'playlist_created', displayData: playlist });
      setStatus('Playlist created successfully');
      console.log('Created playlist:', playlist);
    } catch (err) {
      setError(`Create playlist failed: ${err.message}`);
    }
  };

  const testAddTracksToPlaylist = async () => {
    clearResults();
    try {
      setStatus('Testing add tracks to playlist...');
      
      // First search for some tracks to add
      const tracks = await searchTracks('The Beatles');
      if (tracks.length === 0) {
        setError('No tracks found to add to playlist');
        return;
      }
      
      // Get user's playlists to find one we can modify
      const playlists = await getUserPlaylists();
      const testPlaylist = playlists.find(p => p.name.includes('Test Playlist'));
      
      if (!testPlaylist) {
        setError('No test playlist found. Create a playlist first.');
        return;
      }
      
      // Add first 3 tracks to the playlist
      const trackUris = tracks.slice(0, 3).map(track => track.uri);
      const result = await addTracksToPlaylist(testPlaylist.id, trackUris);
      
      setResults({ 
        type: 'tracks_added', 
        displayData: { 
          playlist: testPlaylist.name, 
          tracksAdded: tracks.slice(0, 3).map(t => `${t.name} by ${t.artists[0].name}`),
          result 
        } 
      });
      setStatus(`Added ${trackUris.length} tracks to playlist`);
      console.log('Add tracks result:', result);
    } catch (err) {
      setError(`Add tracks to playlist failed: ${err.message}`);
    }
  };

  // ====================================
  // Data Structure Analysis
  // ====================================

  const analyzeResponseStructures = async () => {
    clearResults();
    try {
      setStatus('Analyzing Spotify API response structures...');
      
      const [track, artist, user] = await Promise.all([
        searchTracks('test').then(tracks => tracks[0]),
        searchArtists('test').then(artists => artists[0]),
        getCurrentUser()
      ]);
      
      const analysis = {
        track_properties: Object.keys(track || {}),
        artist_properties: Object.keys(artist || {}),
        user_properties: Object.keys(user || {}),
        track_sample: track,
        artist_sample: artist,
        image_structures: {
          track_images: track?.album?.images?.length || 0,
          artist_images: artist?.images?.length || 0
        }
      };
      
      setResults({ type: 'structure_analysis', displayData: analysis });
      setStatus('Response structure analysis complete');
      console.log('Full structure analysis:', analysis);
    } catch (err) {
      setError(`Structure analysis failed: ${err.message}`);
    }
  };

  // Check if user is authenticated before showing component
  if (!isAuthenticated()) {
    return (
      <div style={{ 
        padding: '20px', 
        border: '2px solid #ff6b6b', 
        borderRadius: '8px', 
        margin: '20px',
        backgroundColor: '#fff5f5'
      }}>
        <h2 style={{ color: '#ff6b6b' }}>🔒 Authentication Required</h2>
        <p>You must be authenticated with Spotify to test API functions.</p>
        <p>Please use the OAuth Test Harness first to complete authentication.</p>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '20px', 
      border: '2px solid #1DB954', 
      borderRadius: '8px', 
      margin: '20px',
      backgroundColor: '#f9f9f9'
    }}>
      <h2 style={{ color: '#1DB954' }}>🎵 Spotify API Function Test Harness</h2>
      <p style={{ color: '#666', fontSize: '14px' }}>
        Tests API endpoint functions and response data structures
      </p>

      {/* Search Input */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Search Query:
        </label>
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ 
            padding: '8px', 
            width: '300px', 
            border: '1px solid #ccc', 
            borderRadius: '4px',
            marginRight: '10px'
          }}
          placeholder="Enter search terms..."
        />
      </div>
      
      {/* Search Function Tests */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Search Functions</h3>
        <button onClick={testSearchTracks} style={{ margin: '5px', padding: '8px 12px' }}>
          Search Tracks
        </button>
        <button onClick={testSearchArtists} style={{ margin: '5px', padding: '8px 12px' }}>
          Search Artists
        </button>
        <button onClick={testSearchAlbums} style={{ margin: '5px', padding: '8px 12px' }}>
          Search Albums
        </button>
        <button onClick={testSearchAll} style={{ margin: '5px', padding: '8px 12px', backgroundColor: '#1DB954', color: 'white', border: 'none', borderRadius: '4px' }}>
          Search All Types
        </button>
      </div>

      {/* User Data Tests */}
      <div style={{ marginBottom: '20px' }}>
        <h3>User Data Functions</h3>
        <button onClick={testGetUser} style={{ margin: '5px', padding: '8px 12px' }}>
          Get Current User
        </button>
        <button onClick={testGetPlaylists} style={{ margin: '5px', padding: '8px 12px' }}>
          Get User Playlists
        </button>
        <button onClick={testGetTopTracks} style={{ margin: '5px', padding: '8px 12px' }}>
          Get Top Tracks
        </button>
        <button onClick={testGetTopArtists} style={{ margin: '5px', padding: '8px 12px' }}>
          Get Top Artists
        </button>
        <button onClick={testGetFeaturedPlaylists} style={{ margin: '5px', padding: '8px 12px' }}>
          Get Featured Playlists
        </button>
      </div>

      {/* Playlist Management Tests */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Playlist Management</h3>
        <button onClick={testCreatePlaylist} style={{ margin: '5px', padding: '8px 12px', backgroundColor: '#ffa726', color: 'white', border: 'none', borderRadius: '4px' }}>
          Create Test Playlist
        </button>
        <button onClick={testAddTracksToPlaylist} style={{ margin: '5px', padding: '8px 12px', backgroundColor: '#ffa726', color: 'white', border: 'none', borderRadius: '4px' }}>
          Add Tracks to Playlist
        </button>
      </div>

      {/* Analysis Tools */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Data Analysis</h3>
        <button onClick={analyzeResponseStructures} style={{ margin: '5px', padding: '8px 12px', backgroundColor: '#4ecdc4', color: 'white', border: 'none', borderRadius: '4px' }}>
          Analyze Response Structures
        </button>
      </div>

      {/* Status Display */}
      {status && (
        <div style={{ padding: '10px', backgroundColor: '#e8f5e8', marginBottom: '10px', borderRadius: '4px' }}>
          <strong>Status:</strong> {status}
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div style={{ padding: '10px', backgroundColor: '#ffe8e8', marginBottom: '10px', borderRadius: '4px' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Results Display */}
      {results && (
        <div style={{ marginTop: '20px' }}>
          <h3>Results {results.totalCount && `(Showing 3 of ${results.totalCount})`}:</h3>
          <pre style={{ 
            backgroundColor: '#f0f0f0', 
            padding: '10px', 
            borderRadius: '4px', 
            overflow: 'auto',
            maxHeight: '400px'
          }}>
            {JSON.stringify(results, null, 2)}
          </pre>
        </div>
      )}

      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <strong>Testing Notes:</strong>
        <ul>
          <li>Results show first 3 items; check console for complete data</li>
          <li>All functions require valid Spotify authentication</li>
          <li>Playlist operations modify your actual Spotify account</li>
          <li>Use "Analyze Response Structures" to compare with Last.fm format</li>
        </ul>
      </div>
    </div>
  );
};

export default SpotifyAPITestHarness;