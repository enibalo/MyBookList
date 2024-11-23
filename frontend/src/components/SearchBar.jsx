

import styles from "../styles/SearchBar.module.css";

function SearchBar() {
    return (
      <div className="search-bar">
        <div className="menu-icon">☰</div>
        <input type="text" placeholder="Hinted search text" />
        <div className="search-icon">🔍</div>
      </div>
    );
  }
  
  export default SearchBar;
