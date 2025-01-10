const SearchInput = ({ location, setLocation, onSearch }) => (
    <label htmlFor="searchLocation">
      <input
        type="text"
        placeholder="חפש מיקום"
        name="searchLocation"
        id="searchLocation"
        autoComplete="on"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <button className="sidebar__button" onClick={onSearch}>
        חפש מיקום
      </button>
    </label>
  );
export default SearchInput;