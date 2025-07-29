import './App.css'
import PopularContent from "./components/PopularContent";
import Playlist from "./components/Playlist";
import SearchBar from "./components/SearchBar";
import SearchResults from "./components/SearchResults";
import Track from "./components/Track";

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [popularData, setPopularData] = useState(null);

  return (
    <div>
      <SearchBar onSearch={handleSearch} />
      {searchResults ? (
        <SearchResults data={searchResults} />
      ) : (
        <PopularContent data={popularData} />
      )}
    </div>
  );
}
export default App
