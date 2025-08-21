import { refreshSpotifyToken, initiateSpotifyAuth, getStoredTokens, isTokenExpired } from './spotifyOAuth.js';

// Smart API request function that handles token management
export const makeAuthenticatedRequest = async (url, options = {}) => {
  let { accessToken, expirationTime } = getStoredTokens();
  
  // Check if token needs refresh
  if (!accessToken || isTokenExpired(expirationTime)) {
    try {
      accessToken = await refreshSpotifyToken();
    } catch (error) {
      // Redirect to login if refresh fails
      initiateSpotifyAuth();
      throw new Error('Authentication required');
    }
  }
  
  // Make API request with valid token
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${accessToken}`
    }
  });
  
  // Handle token invalidation during request
  if (response.status === 401) {
    try {
      // Try refresh once more
      accessToken = await refreshSpotifyToken();
      
      // Retry original request
      return fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${accessToken}`
        }
      });
    } catch (refreshError) {
      // If refresh fails, require re-authentication
      initiateSpotifyAuth();
      throw new Error('Authentication required');
    }
  }
  
  return response;
};