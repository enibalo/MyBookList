

import styles from "../styles/SearchBar.module.css";
import  MenuIcon from "../assets/Menu.svg";
import  SearchIcon  from "../assets/Magnifying-Glass.svg";

function SearchBar() {

  const [query, setQuery] = useState("");

  // Handle search input change
  const handleChange = (event) => {
    setQuery(event.target.value);
  };

  // Handle search button click
  const handleSearchClick = () => {
    console.log("Searching for:", query); // This is where you can trigger a search action or API call
  };

  // Handle menu button click
  const handleMenuClick = () => { // handle the event that the menu button is clicked 
    console.log("Menu button clicked"); 
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
        />
        <button className={styles["search-icon"]} aria-label ="Search Button"> 
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

