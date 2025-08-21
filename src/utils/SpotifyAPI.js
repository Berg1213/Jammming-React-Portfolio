import { makeAuthenticatedRequest } from './spotifyAuthWrapper.js';

const SPOTIFY_BASE_URL = 'https://api.spotify.com/v1';

// Search functions
export const searchTracks = async (query) => {
  const response = await makeAuthenticatedRequest(
    `${SPOTIFY_BASE_URL}/search?q=${encodeURIComponent(query)}&type=track&limit=20`
  );
  const data = await response.json();
  return data.tracks.items;
};

export const searchArtists = async (query) => {
  const response = await makeAuthenticatedRequest(
    `${SPOTIFY_BASE_URL}/search?q=${encodeURIComponent(query)}&type=artist&limit=20`
  );
  const data = await response.json();
  return data.artists.items;
};

export const searchAlbums = async (query) => {
  const response = await makeAuthenticatedRequest(
    `${SPOTIFY_BASE_URL}/search?q=${encodeURIComponent(query)}&type=album&limit=20`
  );
  const data = await response.json();
  return data.albums.items;
};

// User profile and playlist functions
export const getCurrentUser = async () => {
  const response = await makeAuthenticatedRequest(`${SPOTIFY_BASE_URL}/me`);
  return response.json();
};

export const getUserPlaylists = async () => {
  const response = await makeAuthenticatedRequest(`${SPOTIFY_BASE_URL}/me/playlists`);
  const data = await response.json();
  return data.items;
};

// Playlist management functions
export const createPlaylist = async (name, description = '', isPublic = false) => {
  const user = await getCurrentUser();
  
  const response = await makeAuthenticatedRequest(
    `${SPOTIFY_BASE_URL}/users/${user.id}/playlists`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        description: description,
        public: isPublic
      })
    }
  );
  
  return response.json();
};

export const addTracksToPlaylist = async (playlistId, trackUris) => {
  const response = await makeAuthenticatedRequest(
    `${SPOTIFY_BASE_URL}/playlists/${playlistId}/tracks`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uris: trackUris
      })
    }
  );
  
  return response.json();
};

// Featured/Popular content
export const getFeaturedPlaylists = async () => {
  const response = await makeAuthenticatedRequest(`${SPOTIFY_BASE_URL}/browse/featured-playlists`);
  const data = await response.json();
  return data.playlists.items;
};

export const getTopTracks = async (timeRange = 'medium_term') => {
  const response = await makeAuthenticatedRequest(
    `${SPOTIFY_BASE_URL}/me/top/tracks?time_range=${timeRange}&limit=20`
  );
  const data = await response.json();
  return data.items;
};

export const getTopArtists = async (timeRange = 'medium_term') => {
  const response = await makeAuthenticatedRequest(
    `${SPOTIFY_BASE_URL}/me/top/artists?time_range=${timeRange}&limit=20`
  );
  const data = await response.json();
  return data.items;
};