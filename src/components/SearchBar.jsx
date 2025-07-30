function SearchBar({ searchTerm, setSearchTerm, handleSearch }) {

  return (
    <>
        <div className="search">
          <form onSubmit={handleSearch} className="search-form">
            <input 
                type="text" 
                placeholder="search" 
                className="search-input" 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
                />
            <button type="submit" className="search-button">Search</button>
          </form>
        </div>
    </>
  );
}