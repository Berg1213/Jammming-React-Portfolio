import { useState } from "react";
import { filterAndSortByRelevance } from "../utils/LastFMAPI";

function SearchResults({ data, loading, searchTerm }) {
  const [artistSliceSize, setArtistSliceSize] = useState(5);
  const [trackSliceSize, setTrackSliceSize] = useState(5);
  const [albumSliceSize, setAlbumSliceSize] = useState(5);

  const allArtists = data.artists || [];
  const allTracks = data.tracks || [];

  console.log('Total artists before filtering:', allArtists.length);
  console.log('All artist names:', allArtists.map(a => a.name));
  console.log('Looking for names starting with:', searchTerm);
  
  console.log('Tag search response sample:', data.artistTags?.[0]);
  console.log('Available properties:', Object.keys(data.artistTags?.[0] || {}));
  console.log('Track tag sample:', data.trackTags?.[0]);
  console.log('Track tag properties:', Object.keys(data.trackTags?.[0] || {}));

  console.log('Album tag sample:', (data.albumTags || [])[0]);
  console.log('Album tag properties:', Object.keys((data.albumTags || [])[0] || {}));
  console.log('First 3 albums:', (data.albumTags || []).slice(0, 3));
  console.log('Album sample @attr:', (data.albumTags || [])[0]?.['@attr']);

  if (loading) {
    return <div>Loading search results...</div>
  }

  if (!allTracks.length && !allArtists.length && !(data.albumTags || []).length) {
    return (   
      <div className="no-results">The search returned no results. Please check spelling or try a different search</div>
    )
  } else {
    return (
      <div className="results-found">
        {allArtists.length > 0 && (
          <div className="artist-results">
            <h2>Artists</h2>
            {allArtists.slice(0, artistSliceSize).map(artist => (
              <div key={artist.url}>
                <h3>{artist.name}</h3>
               <p>{artist.listeners} listeners</p>
              </div>
            ))}
            <button onClick={() => setArtistSliceSize(prev => prev + 5)}> + </button>
          </div>
        )}

        {allTracks.length > 0 && (
          <div className="track-results">
            <h2>Tracks</h2>
            {allTracks.slice(0, trackSliceSize).map(track => (
              <div key={track.url}>
                <h3>{track.name}</h3>
                <p>{track?.artist ||track.artist.name}</p>
                <p>{track.listeners} listeners</p>
              </div>
            ))}
            <button onClick={() => setTrackSliceSize(prev => prev + 5)}> + </button>
          </div>
        )}        

        {(data.albumTags || []).length > 0 && (
          <div className="album-results">
            <h2>Albums</h2>
            {data.albumTags.slice(0, albumSliceSize).map(album => (
              <div key={album.url}>
                <h3>{album.name}</h3>
                  <p>{album.artist.name}</p>
              </div>
            ))}
            <button onClick={() => setAlbumSliceSize(prev => prev + 5)}> + </button>
          </div>
        )}
      </div>
    )
  }
}

export default SearchResults;






