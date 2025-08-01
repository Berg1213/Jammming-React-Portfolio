function PopularContent({ tracks, artists, loading }) {

  console.log('Artists received:', artists);
  console.log('Tracks received:', tracks);
  
  if (artists && artists.length > 0) {
    console.log('First artist:', artists[0]);
    console.log('First artist image array:', artists[0]?.image);
    console.log('First artist image object:', artists[0].image[2]);
    console.log('Image array length:', artists[0]?.image?.length);
    console.log('All artist images:', artists[0].image);

  }
  
  if (tracks && tracks.length > 0) {
    console.log('First track:', tracks[0]);
    console.log('First track image array:', tracks[0]?.image);
    console.log('First track image object:', tracks[0].image[2]);
    console.log('All track images:', tracks[0].image);

  }
  if (loading) {
    return <div>Loading popular content data...</div>;
  };

  const isPlaceholder = (imageUrl) => {
    return imageUrl?.includes('2a96cbd8b46e442fc41c2b86b821562f.png');
  };

  return (
    <div className="popular-content">
      <div className="popular-tracks">{tracks?.map(track => (
        <div key={track.url}>
          {!isPlaceholder(track.image[2]?.['#text']) && (
            <img src={track.image[2]?.['#text']} alt={track.name} />
          )}
          <h3>{track.name}</h3>
          <p>by {track.artist?.name || track.artist}</p>
          <p>{track.playcount} plays</p>
          <p>{track.listeners} listeners</p>
          <a href={track.url}>View on Last.fm</a>
        </div>
      ))}
      </div>
      <div className="popular-artists">{artists?.map(artist => (
        <div key={artist.url}>
          {!isPlaceholder(artist.image[2]?.['#text']) && (
            <img src={artist.image[2]?.['#text']} alt={artist.name} />
          )}
          <h3>{artist.name}</h3>
          <p>{artist.playcount} plays</p>
          <p>{artist.listeners} listeners</p>
          <a href={artist.url}>View on Last.fm</a>
        </div>
      ))}
      </div>
    </div>
  );
}

export default PopularContent;
