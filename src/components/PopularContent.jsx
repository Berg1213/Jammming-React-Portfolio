function PopularContent({ tracks, artists }) {

  return (
    <div className="popular-content">
      <div className="popular-tracks">{tracks?.map(track => (
        <div key={track.url}>
          <img src={track.image[2]['#text']} alt={track.name} />
          <h3>{track.name}</h3>
          <p>by {track.artist}</p>
          <p>{track.playcount} plays</p>
          <p>{track.listeners} listeners</p>
          <a href={track.url}>View on Last.fm</a>
        </div>
      ))}
      </div>
      <div className="popular-artists">{artists?.map(artist => (
        <div key={artist.url}>
          <img src={artist.image[2]['#text']} alt={artist.name} />
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
