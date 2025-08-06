const API_KEY = import.meta.env.VITE_LASTFM_API_KEY;
const BASE_URL = 'https://ws.audioscrobbler.com/2.0/';

export const searchTracks = async (query) => {
  const response = await fetch(
    `${BASE_URL}?method=track.search&track=${query}&api_key=${API_KEY}&format=json&limit=20`
  );
  const data = await response.json();

  console.log('Full API response:', data);
  console.log('Available keys:', Object.keys(data));
  console.log('API Key from env:', import.meta.env.VITE_LASTFM_API_KEY);
  console.log('API Key length:', import.meta.env.VITE_LASTFM_API_KEY?.length);

  return data.results.trackmatches.track;
};

export const searchArtists = async (query) => {
  const response = await fetch(
    `${BASE_URL}?method=artist.search&artist=${query}&api_key=${API_KEY}&format=json&limit=20`
  );
  const data = await response.json();
  return data.results.artistmatches.artist;
};

export const searchAlbums = async (query) => {
  const response = await fetch(
    `${BASE_URL}?method=album.search&album=${query}&api_key=${API_KEY}&format=json&limit=20`
  );
  const data = await response.json();
  return data.results.albummatches.album;
};

export const searchAlbumsByTag = async (tag) => {
  const response = await fetch(
    `${BASE_URL}?method=tag.getTopAlbums&tag=${tag}&api_key=${API_KEY}&format=json&limit=20`
  );
  const data = await response.json();
  return data.albums.album;
};

export const searchArtistsByTag = async (tag) => {
  const response = await fetch(
    `${BASE_URL}?method=tag.getTopArtists&tag=${tag}&api_key=${API_KEY}&format=json&limit=20`
  );
  const data = await response.json();
  return data.topartists.artist;
};

export const searchTracksByTag = async (tag) => {
  const response = await fetch(
    `${BASE_URL}?method=tag.getTopTracks&tag=${tag}&api_key=${API_KEY}&format=json&limit=20`
  );
  const data = await response.json();
  return data.tracks.track;
};

// export const getTopAlbums = async () => {
//   const response = await fetch(
//     `${BASE_URL}?method=chart.getTopAlbums&api_key=${API_KEY}&format=json&limit=12`
//   );
//   const data = await response.json();
// 
//   console.log('Top Albums full response:', data);
//   console.log('Top-level keys:', Object.keys(data));
//   return data;
// };

export const getTopArtists = async () => {
  const response = await fetch(
    `${BASE_URL}?method=chart.getTopArtists&api_key=${API_KEY}&format=json&limit=1000`
  );
  const data = await response.json();
  return data.artists.artist;
};

export const getTopTracks = async () => {
  const response = await fetch(
    `${BASE_URL}?method=chart.getTopTracks&api_key=${API_KEY}&format=json&limit=1000`
  );
  const data = await response.json();
  return data.tracks.track;
};