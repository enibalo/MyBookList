import React from "react";
import styles from "../styles/SearchBar.module.css";
import SearchIcon from "../assets/Magnifying-Glass.svg";

function SearchBar({ onSearch, onSearchSubmit, customStyle }) {
  const [inputValue, setInputValue] = React.useState("");

  // Handle input change and update the state
  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);
    onSearch(value); // Pass the input value to the parent component
  };

  // Handle button click and notify the parent
  const handleSearchClick = () => {
    onSearchSubmit(inputValue); // Trigger parent search functionality
  };

  return (
    <div
      className={styles["header-container"]}
      style={customStyle ? customStyle.header : null}
    >
      <div className={styles["search-bar"]}>
        <input
          type="text"
          className={styles["search-input"]}
          placeholder="Hinted search text"
          value={inputValue} // Bind input value to state
          onChange={handleInputChange} // Handle change
        />
        <button
          className={styles["search-icon"]}
          aria-label="Search Button"
          style={customStyle ? customStyle.icon : null}
          onClick={handleSearchClick} // Handle button click
        >
          <img
            alt="Search Icon"
            aria-label="User Pressed Search"
            className={styles.icon}
            src={SearchIcon}
            width={15}
            height={15}
          />
        </button>
      </div>
    </div>
  );
}

export default SearchBar;
