import { useState } from "react";

function SearchResults({ data, loading }) {
  const [artistSliceSize, setArtistSliceSize] = useState(5);
  const [trackSliceSize, setTrackSliceSize] = useState(5);
  const [albumSliceSize, setAlbumSliceSize] = useState(5);
  
  const allArtists = [...(data.artists || []), (data.artistTags || [])];
  const allTracks = [...(data.tracks || []), (data.trackTags || [])];

  if (loading) {
    return <div>Loading search results...</div>
  }
  
  return (
    <div className="search-results">
      <div className="artist-results">
        <h2>Artists</h2>
        {allArtists.slice(0, artistSliceSize).map(artist => (
          <div key={artist.url}>
            <h3>{artist.name}</h3>
            <p>{artist.playcount} plays</p>
            <p>{artist.listeners} listeners</p>
          </div>
        ))}
        <button onClick={setArtistSliceSize(prev => prev + 5)}> + </button>
      </div>

      <div className="track-results">
        <h2>Tracks</h2>
        {allTracks.slice(0, trackSliceSize).map(track => (
          <div key={track.url}>
            <h3>{track.name}</h3>
            <p>{track.playcount} plays</p>
            <p>{track.listeners} listeners</p>
          </div>
        ))}
        <button onClick={setTrackSliceSize(prev => prev + 5)}> + </button>
      </div>
      
      <div className="album-results">
        <h2>Albums</h2>
        {data.albumTags.slice(0, albumSliceSize).map(album => (
          <div key={album.url}>
            <h3>{album.name}</h3>
            <p>{album.playcount} plays</p>
            <p>{album.listeners} listeners</p>
          </div>
        ))}
        <button onClick={setAlbumSliceSize(prev => prev + 5)}> + </button>
      </div>
    </div>
    );
}


export default SearchResults;