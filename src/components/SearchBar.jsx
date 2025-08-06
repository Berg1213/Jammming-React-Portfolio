function SearchBar({ searchTerm, setSearchTerm, handleSearch,suggestions }) {
  console.log('SearchBar received:', typeof handleSearch)
  return (
    <>
        <div className="search">
          <form onSubmit={handleSearch} className="search-form">
            <input 
                type="text" 
                placeholder="Search for music..." 
                className="search-input" 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
                />
            <button type="submit" className="search-button">Search</button>
          </form>

          {suggestions && suggestions.length > 0 && (
            <div className="suggestions-dropdown">
              {suggestions.map((suggestion, index) => (
                suggestion?.artist ? (<div 
                                        key={index} 
                                        className="suggestion-item" 
                                        onClick={(e) => handleSearch(e, suggestion)}
                                        >
                  {`${suggestion.name} -- ${suggestion.artist?.name || suggestion.artist}`}
                  </div>
                  ) : (
                <div 
                  key={index} 
                  className="suggestion-item" 
                  onClick={(e) => handleSearch(e, suggestion)}
                  >
                  {suggestion.name}
                </div>
                )
              ))}
            </div>
          )}
        </div>
    </>
  );
}

export default SearchBar;