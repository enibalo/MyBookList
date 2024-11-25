

import styles from "../styles/SearchBar.module.css";

function SearchBar() {
  return (
    <div className={styles["header-container"]}>
      <button className={styles["menu-icon"]}>☰</button>
      <div className={styles["search-bar"]}>
        <input
          type="text"
          className={styles["search-input"]}
          placeholder="Hinted search text"
        />
        <button className={styles["search-icon"]} aria-label ="Search Button"> 🔍 </button>
      </div>
    </div>
  );
}

export default SearchBar;

