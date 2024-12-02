

import styles from "../styles/SearchBar.module.css";
import  MenuIcon from "../assets/Menu.svg";
import  SearchIcon  from "../assets/Magnifying-Glass.svg";

function SearchBar() {
  const [searchQuery, setSearchQuery] = useState(""); // State for the input text

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value); // Update search query as user types
  };

  const handleSearchClick = () => {
    onSearch(searchQuery); // Pass the search query to the parent
  };

  return (
    <div className={styles["header-container"]}>
      <button className={styles["menu-icon"]}>
      <img
                  alt="Menu Icon"
                  aria-label="User Pressed Menu"
                  className={styles.icon}
                  src={MenuIcon}
                  width={15}
                  height={15}
                ></img>
        
      </button>
      <div className={styles["search-bar"]}>
        <input
          type="text"
          className={styles["search-input"]}
          placeholder="Hinted search text"
          onChange={handleSearchInputChange}
        />
        <button className={styles["search-icon"]} 
                          aria-label ="Search Button"
                          onClick={handleSearchClick}> 
        <img
                  alt="Search Icon"
                  aria-label="User Pressed Search"
                  className={styles.icon}
                  src={SearchIcon}
                  width={15}
                  height={15}
                ></img>
        </button>
      </div>
    </div>
  );
}

export default SearchBar;

