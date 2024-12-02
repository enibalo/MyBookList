

import styles from "../styles/SearchBar.module.css";
import  MenuIcon from "../assets/Menu.svg";
import  SearchIcon  from "../assets/Magnifying-Glass.svg";

function SearchBar() {


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
          onChange={(e) => onSearch(e.target.value)}
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

