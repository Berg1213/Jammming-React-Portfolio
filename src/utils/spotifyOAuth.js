// oauth.js - Pure OAuth Flow Management
// Location: /src/utils/oauth.js

const oauthConfig = {
  clientId: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
  clientSecret: import.meta.env.VITE_SPOTIFY_CLIENT_SECRET,
  redirectUri: import.meta.env.VITE_SPOTIFY_REDIRECT_URI || 'http://localhost:3000/callback',
  authorizationUrl: 'https://accounts.spotify.com/authorize',
  tokenUrl: 'https://accounts.spotify.com/api/token',
  scope: 'user-read-private user-read-email playlist-read-private playlist-modify-public playlist-modify-private'
};

// Generate random state for CSRF protection
const generateRandomState = () => {
  return Math.random().toString(36).substring(2, 15) +
         Math.random().toString(36).substring(2, 15);
};

// Build authorization URL and redirect user to Spotify
export const initiateSpotifyAuth = () => {
  const state = generateRandomState();
  localStorage.setItem('spotify_auth_state', state);
  
  const authUrl = `${oauthConfig.authorizationUrl}?` +
    `client_id=${oauthConfig.clientId}&` +
    `redirect_uri=${encodeURIComponent(oauthConfig.redirectUri)}&` +
    `scope=${encodeURIComponent(oauthConfig.scope)}&` +
    `response_type=code&` +
    `state=${state}`;
  
  window.location.href = authUrl;
};

// Handle the callback from Spotify with authorization code
export const handleSpotifyCallback = async (authorizationCode, state) => {
  // Verify state parameter for CSRF protection
  const storedState = localStorage.getItem('spotify_auth_state');
  if (state !== storedState) {
    throw new Error('Invalid state parameter');
  }
  localStorage.removeItem('spotify_auth_state');

  try {
    const tokenResponse = await fetch(oauthConfig.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: oauthConfig.clientId,
        client_secret: oauthConfig.clientSecret,
        redirect_uri: oauthConfig.redirectUri,
        code: authorizationCode
      })
    });

    if (!tokenResponse.ok) {
      throw new Error('Token exchange failed');
    }

    const tokens = await tokenResponse.json();
    storeTokens(tokens);
    
    return tokens;
  } catch (error) {
    console.error('OAuth callback failed:', error);
    throw error;
  }
};

// Exchange refresh token for new access token
export const refreshSpotifyToken = async () => {
  const { refreshToken } = getStoredTokens();
  
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  try {
    const response = await fetch(oauthConfig.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: oauthConfig.clientId,
        client_secret: oauthConfig.clientSecret,
        refresh_token: refreshToken
      })
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    const newTokens = await response.json();
    
    // Store the new tokens (keeping the same refresh token if not provided)
    const tokensToStore = {
      access_token: newTokens.access_token,
      refresh_token: newTokens.refresh_token || refreshToken, // Keep existing if new one not provided
      expires_in: newTokens.expires_in
    };
    
    storeTokens(tokensToStore);
    
    return newTokens.access_token;
  } catch (error) {
    console.error('Token refresh failed:', error);
    clearSpotifyTokens();
    throw error;
  }
};

// ====================================
// Token storage utilities
// ====================================

const storeTokens = (tokens) => {
  localStorage.setItem('spotify_access_token', tokens.access_token);
  localStorage.setItem('spotify_refresh_token', tokens.refresh_token);
  
  const expirationTime = Date.now() + ((tokens.expires_in - 60) * 1000);
  localStorage.setItem('spotify_token_expiration', expirationTime.toString());
};

const getStoredTokens = () => {
  return {
    accessToken: localStorage.getItem('spotify_access_token'),
    refreshToken: localStorage.getItem('spotify_refresh_token'),
    expirationTime: parseInt(localStorage.getItem('spotify_token_expiration'))
  };
};

const isTokenExpired = (expirationTime) => {
  return Date.now() >= expirationTime;
};

export const clearSpotifyTokens = () => {
  localStorage.removeItem('spotify_access_token');
  localStorage.removeItem('spotify_refresh_token');
  localStorage.removeItem('spotify_token_expiration');
  localStorage.removeItem('spotify_auth_state');
};

export const isAuthenticated = () => {
  const { accessToken, refreshToken } = getStoredTokens();
  return !!(accessToken || refreshToken);
};

export { getStoredTokens, isTokenExpired };