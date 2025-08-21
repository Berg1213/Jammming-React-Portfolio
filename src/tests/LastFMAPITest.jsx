import React, { useEffect, useState } from 'react';
import { 
  searchTracks, 
  searchArtists, 
  searchAlbums,
  getTopAlbums,
  getTopArtists, 
  getTopTracks,
  searchAlbumsByTag,
  searchArtistsByTag,
  searchTracksByTag
} from '../utils/LastFMAPI.js';

// Mock functions for testing - replace these with your actual API calls
const mockAPICall = async (endpoint, params = '') => {
  // This is just for demonstration - replace with your actual API calls
  const API_KEY = import.meta.env.VITE_LASTFM_API_KEY;;
  const BASE_URL = 'https://ws.audioscrobbler.com/2.0/';
  
  const response = await fetch(`${BASE_URL}?${endpoint}&api_key=${API_KEY}&format=json${params}`);
  const data = await response.json();
  return data;
};

const APITestComponent = () => {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState('');

  useEffect(() => {
    window.searchTracks = searchTracks;
    window.searchArtists = searchArtists;
    window.searchAlbums = searchAlbums;
    window.getTopAlbums = getTopAlbums;
    window.getTopArtists = getTopArtists;
    window.getTopTracks = getTopTracks;
    window.searchAlbumsByTag = searchAlbumsByTag;
    window.searchArtistsByTag = searchArtistsByTag;
    window.searchTracksByTag = searchTracksByTag;
    }, []);

  const runTest = async (testName, testFunction, ...params) => {
    setLoading(testName);
    try {
      console.log(`\n=== Testing ${testName} ===`);
      const result = await testFunction(...params);
      console.log(`${testName} result:`, result);
      console.log(`${testName} result type:`, typeof result);
      console.log(`${testName} is array:`, Array.isArray(result));
      if (Array.isArray(result) && result.length > 0) {
        console.log(`${testName} first item:`, result[0]);
        console.log(`${testName} first item keys:`, Object.keys(result[0]));
      }
      setTestResults(prev => ({ ...prev, [testName]: 'Success ✅' }));
    } catch (error) {
      console.error(`${testName} error:`, error);
      setTestResults(prev => ({ ...prev, [testName]: 'Error ❌' }));
    }
    setLoading('');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Last.fm API Test Suite</h1>
      <p>Open your browser console (F12) to see detailed results!</p>
      
      <div style={{ marginBottom: '30px' }}>
        <h2>Search Functions</h2>
        <button 
          onClick={() => runTest('searchTracks', searchTracks, 'taylor swift')}
          disabled={loading === 'searchTracks'}
        >
          {loading === 'searchTracks' ? 'Testing...' : 'Test Track Search'} {testResults.searchTracks}
        </button>
        
        <button 
          onClick={() => runTest('searchArtists', searchArtists, 'taylor swift')}
          disabled={loading === 'searchArtists'}
        >
          {loading === 'searchArtists' ? 'Testing...' : 'Test Artist Search'} {testResults.searchArtists}
        </button>
        
        <button 
          onClick={() => runTest('searchAlbums', searchAlbums, 'folklore')}
          disabled={loading === 'searchAlbums'}
        >
          {loading === 'searchAlbums' ? 'Testing...' : 'Test Album Search'} {testResults.searchAlbums}
        </button>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h2>Popular/Chart Functions</h2>
        <button 
          onClick={() => runTest('getTopAlbums', getTopAlbums)}
          disabled={loading === 'getTopAlbums'}
        >
          {loading === 'getTopAlbums' ? 'Testing...' : 'Test Top Albums'} {testResults.getTopAlbums}
        </button>
        
        <button 
          onClick={() => runTest('getTopArtists', getTopArtists)}
          disabled={loading === 'getTopArtists'}
        >
          {loading === 'getTopArtists' ? 'Testing...' : 'Test Top Artists'} {testResults.getTopArtists}
        </button>
        
        <button 
          onClick={() => runTest('getTopTracks', getTopTracks)}
          disabled={loading === 'getTopTracks'}
        >
          {loading === 'getTopTracks' ? 'Testing...' : 'Test Top Tracks'} {testResults.getTopTracks}
        </button>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h2>Tag Search Functions</h2>
        <button 
          onClick={() => runTest('searchAlbumsByTag', searchAlbumsByTag, 'rock')}
          disabled={loading === 'searchAlbumsByTag'}
        >
          {loading === 'searchAlbumsByTag' ? 'Testing...' : 'Test Albums by Tag (rock)'} {testResults.searchAlbumsByTag}
        </button>
        
        <button 
          onClick={() => runTest('searchArtistsByTag', searchArtistsByTag, 'indie')}
          disabled={loading === 'searchArtistsByTag'}
        >
          {loading === 'searchArtistsByTag' ? 'Testing...' : 'Test Artists by Tag (indie)'} {testResults.searchArtistsByTag}
        </button>
        
        <button 
          onClick={() => runTest('searchTracksByTag', searchTracksByTag, 'electronic')}
          disabled={loading === 'searchTracksByTag'}
        >
          {loading === 'searchTracksByTag' ? 'Testing...' : 'Test Tracks by Tag (electronic)'} {testResults.searchTracksByTag}
        </button>
      </div>

      <div style={{ marginTop: '30px' }}>
        <h2>Test All Functions</h2>
        <button 
          onClick={async () => {
            await runTest('searchTracks', searchTracks, 'hello');
            await runTest('searchArtists', searchArtists, 'adele');
            await runTest('searchAlbums', searchAlbums, '25');
            await runTest('getTopAlbums', getTopAlbums);
            await runTest('getTopArtists', getTopArtists);
            await runTest('getTopTracks', getTopTracks);
            await runTest('searchAlbumsByTag', searchAlbumsByTag, 'pop');
            await runTest('searchArtistsByTag', searchArtistsByTag, 'jazz');
            await runTest('searchTracksByTag', searchTracksByTag, 'hip hop');
            console.log('\n🎉 All tests completed! Check results above.');
          }}
          disabled={loading}
          style={{ 
            backgroundColor: '#4CAF50', 
            color: 'white', 
            padding: '10px 20px',
            fontSize: '16px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          {loading ? `Testing ${loading}...` : 'Run All Tests'}
        </button>
      </div>

      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <p><strong>Instructions:</strong></p>
        <ol>
          <li>Open your browser console (F12 → Console tab)</li>
          <li>Click any test button</li>
          <li>Check the console for detailed output</li>
          <li>Look for the data structure and adjust your utility functions if needed</li>
        </ol>
      </div>
    </div>
  );
};

export default APITestComponent;