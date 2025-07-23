const API_KEY = '04eb07a6cea42e6f49001f0bab8c94f5';
const BASE_URL = 'https://ws.audioscrobbler.com/2.0/';

export const searchTracks = async (query) => {
  const response = await fetch(
    `${BASE_URL}?method=track.search&track=${query}&api_key=${API_KEY}&format=json&limit=20`
  );
  const data = await response.json();
  return data.results.trackmatches.track;
};

export const searchArtists = async (query) => {
  const response = await fetch(
    `${BASE_URL}?method=artist.search&artist=${query}&api_key=${API_KEY}&format=json&limit=20`
  );
  const data = await response.json();
  return data.results.artistmatches.artist;
};