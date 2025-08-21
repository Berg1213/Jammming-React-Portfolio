import { useState } from 'react';
import { initiateSpotifyAuth, handleSpotifyCallback, clearSpotifyTokens, isAuthenticated } from '../utils/spotifyOAuth.js';

const OAuthTestHarness = () => {
  const [results, setResults] = useState(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  // Clear any previous results/errors
  const clearResults = () => {
    setResults(null);
    setError('');
    setStatus('');
  };

  // ====================================
  // OAuth Flow Tests
  // ====================================

  const testLogin = () => {
    console.log('clientId:', import.meta.env.VITE);
    clearResults();
    setStatus('Redirecting to Spotify...');
    initiateSpotifyAuth();
  };

  const testCallback = async () => {
    clearResults();
    try {
      // Extract callback parameters from current URL
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');
      
      if (code && state) {
        setStatus('Processing callback...');
        const tokens = await handleSpotifyCallback(code, state);
        setResults({ 
          success: 'OAuth callback successful', 
          tokens: {
            access_token: tokens.access_token ? 'Present' : 'Missing',
            refresh_token: tokens.refresh_token ? 'Present' : 'Missing',
            expires_in: tokens.expires_in
          }
        });
        setStatus('Authentication complete!');
      } else {
        setStatus('No callback parameters found in URL. Make sure you\'re testing after Spotify redirect.');
        setResults({ code: code || 'Missing', state: state || 'Missing' });
      }
    } catch (err) {
      setError(`Callback failed: ${err.message}`);
    }
  };

  const checkAuthStatus = () => {
    clearResults();
    const authenticated = isAuthenticated();
    const tokenInfo = {
      accessToken: localStorage.getItem('spotify_access_token') ? 'Present' : 'Missing',
      refreshToken: localStorage.getItem('spotify_refresh_token') ? 'Present' : 'Missing',
      expiration: localStorage.getItem('spotify_token_expiration'),
      expirationDate: localStorage.getItem('spotify_token_expiration') 
        ? new Date(parseInt(localStorage.getItem('spotify_token_expiration'))).toLocaleString()
        : 'No expiration set'
    };
    
    setResults({ 
      authenticated, 
      message: authenticated ? 'User is authenticated' : 'User not authenticated',
      tokenInfo 
    });
  };

  // ====================================
  // Token Management Tests
  // ====================================

  const testExpiredToken = () => {
    clearResults();
    // Force token expiration
    localStorage.setItem('spotify_token_expiration', '1000'); // Way in the past
    setStatus('Access token forced to expire. Token should now be considered invalid.');
    
    // Show updated status
    setTimeout(() => {
      const expired = Date.now() >= parseInt(localStorage.getItem('spotify_token_expiration'));
      setResults({ 
        action: 'Token expiration forced',
        expired: expired,
        message: expired ? 'Token is now expired' : 'Something went wrong - token not expired'
      });
    }, 100);
  };

  const testInvalidRefreshToken = () => {
    clearResults();
    // Corrupt the refresh token
    const originalToken = localStorage.getItem('spotify_refresh_token');
    localStorage.setItem('spotify_refresh_token', 'invalid_token_12345');
    setStatus('Refresh token corrupted. Next API call should trigger re-authentication.');
    setResults({ 
      action: 'Refresh token corrupted',
      original: originalToken ? 'Had valid token' : 'No token present',
      current: 'Now has invalid token'
    });
  };

  const testNoTokens = () => {
    clearResults();
    const hadTokens = {
      accessToken: !!localStorage.getItem('spotify_access_token'),
      refreshToken: !!localStorage.getItem('spotify_refresh_token')
    };
    
    clearSpotifyTokens();
    setStatus('All tokens cleared. App should require full re-authentication.');
    setResults({ 
      action: 'All tokens cleared',
      previousState: hadTokens,
      currentState: {
        accessToken: false,
        refreshToken: false
      }
    });
  };

  const resetToValidState = () => {
    clearResults();
    clearSpotifyTokens();
    setStatus('Cleared all test modifications. Ready for fresh OAuth flow.');
    setResults({ action: 'Reset complete', message: 'All tokens cleared - ready for new authentication' });
  };

  // ====================================
  // State Parameter Security Tests
  // ====================================

  const testStateValidation = async () => {
    clearResults();
    try {
      setStatus('Testing state parameter validation...');
      // Try callback with intentionally wrong state
      await handleSpotifyCallback('fake_auth_code', 'wrong_state_value');
      setError('Security test failed - invalid state was accepted!');
    } catch (err) {
      // This SHOULD fail - that's the correct behavior
      setResults({ 
        security: 'PASSED',
        message: 'State validation correctly rejected invalid state parameter',
        error: err.message
      });
      setStatus('State validation working correctly');
    }
  };

  const logCurrentTokenState = () => {
    clearResults();
    const tokens = {
      accessToken: localStorage.getItem('spotify_access_token'),
      refreshToken: localStorage.getItem('spotify_refresh_token'),
      expiration: localStorage.getItem('spotify_token_expiration'),
      expirationDate: localStorage.getItem('spotify_token_expiration')
        ? new Date(parseInt(localStorage.getItem('spotify_token_expiration'))).toLocaleString()
        : 'No expiration set',
      state: localStorage.getItem('spotify_auth_state'),
      isExpired: localStorage.getItem('spotify_token_expiration') 
        ? Date.now() >= parseInt(localStorage.getItem('spotify_token_expiration'))
        : 'No expiration to check'
    };
    setResults({ type: 'token_state', data: tokens });
    console.log('Current token state:', tokens);
  };

  return (
    <div style={{ 
      padding: '20px', 
      border: '2px solid #1DB954', 
      borderRadius: '8px', 
      margin: '20px',
      backgroundColor: '#f9f9f9'
    }}>
      <h2 style={{ color: '#1DB954' }}> OAuth Flow Test Harness</h2>
      <p style={{ color: '#666', fontSize: '14px' }}>
        Tests authentication flow, token management, and security validation
      </p>
      
      {/* OAuth Flow Tests */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Authentication Flow</h3>
        <button onClick={testLogin} style={{ margin: '5px', padding: '8px 12px', backgroundColor: '#1DB954', color: 'white', border: 'none', borderRadius: '4px' }}>
          1. Login with Spotify
        </button>
        <button onClick={testCallback} style={{ margin: '5px', padding: '8px 12px' }}>
          2. Process Callback
        </button>
        <button onClick={checkAuthStatus} style={{ margin: '5px', padding: '8px 12px' }}>
          Check Auth Status
        </button>
        <button onClick={resetToValidState} style={{ margin: '5px', padding: '8px 12px', backgroundColor: '#4ecdc4', color: 'white', border: 'none', borderRadius: '4px' }}>
          Reset to Clean State
        </button>
      </div>

      {/* Token Management Tests */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Token Management Failure Tests</h3>
        <button onClick={testExpiredToken} style={{ margin: '5px', padding: '8px 12px', backgroundColor: '#ff6b6b', color: 'white', border: 'none', borderRadius: '4px' }}>
          Force Token Expiration
        </button>
        <button onClick={testInvalidRefreshToken} style={{ margin: '5px', padding: '8px 12px', backgroundColor: '#ff6b6b', color: 'white', border: 'none', borderRadius: '4px' }}>
          Corrupt Refresh Token
        </button>
        <button onClick={testNoTokens} style={{ margin: '5px', padding: '8px 12px', backgroundColor: '#ff6b6b', color: 'white', border: 'none', borderRadius: '4px' }}>
          Clear All Tokens
        </button>
      </div>

      {/* Security Tests */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Security & Diagnostics</h3>
        <button onClick={testStateValidation} style={{ margin: '5px', padding: '8px 12px', backgroundColor: '#ffa726', color: 'white', border: 'none', borderRadius: '4px' }}>
          Test State Validation
        </button>
        <button onClick={logCurrentTokenState} style={{ margin: '5px', padding: '8px 12px', backgroundColor: '#4ecdc4', color: 'white', border: 'none', borderRadius: '4px' }}>
          Log Token State
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
          <h3>Results:</h3>
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
        <strong>Testing Workflow:</strong>
        <ol>
          <li><strong>Authentication:</strong> Login → Process Callback → Check Status</li>
          <li><strong>Token Management:</strong> Test expiration and refresh scenarios</li>
          <li><strong>Security:</strong> Verify state parameter validation</li>
          <li><strong>Recovery:</strong> Use "Reset to Clean State" between tests</li>
        </ol>
      </div>
    </div>
  );
};

export default OAuthTestHarness;