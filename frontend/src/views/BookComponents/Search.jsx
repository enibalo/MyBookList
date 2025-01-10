import { useEffect, useState } from "react";
import SearchBar from "../../components/SearchBar.jsx"; // Adjust the path if needed

import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import axios from "axios";

function Search({ handleClick }) {
  const [filteredBooks, setFilteredBooks] = useState([]); // Filtered books for display
  const [searchTerm, setSearchTerm] = useState(""); // Current search term
  const [searched, setSearched] = useState(false);

  const handleSearch = (value) => {
    setSearchTerm(value); // Update search term as the user types
  };

  const handleSearchSubmit = () => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    async function getData() {
      axios
        .get("http://localhost:8800/books/filtered?search=" + lowerSearchTerm)
        .then((result) => {
          setFilteredBooks(result.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    setSearched(true);
    getData();
  };

  return (
    <div>
      <div style={styles.searchBarContainer}>
        <SearchBar
          customStyle={{
            header: { width: "auto", margin: "auto" },
            icon: { transform: "none" },
          }}
          onSearch={handleSearch}
          onSearchSubmit={handleSearchSubmit}
        />
      </div>

      <ul style={styles.button_container}>
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
            <li key={book.ISBN} style={styles.li}>
              <button
                style={styles.button}
                onClick={() => {
                  handleClick(book);
                }}
              >
                <span style={{ fontWeight: "bold" }}>Title:</span> {book.Title}
                <br />
                <br />
                <span style={{ fontWeight: "bold" }}>Author: </span>{" "}
                {book.AuthorName}
                <br />
              </button>
            </li>
          ))
        ) : searched == false ? (
          <p style={styles.p}>Search for a book!</p>
        ) : (
          <p style={styles.p}>No books found.</p>
        )}
      </ul>
    </div>
  );
}

const styles = {
  li: {
    display: "flex",
  },
  h2: {
    textAlign: "center",
  },
  searchBarContainer: {
    display: "flex",
    justifyContent: "center",
    marginTop: "20px",
  },
  p: {
    textAlign: "center",
    margin: "10px 0px",
  },
  button: {
    fontFamily: "inherit",
    margin: "15px",
    flexBasis: "100%",
    padding: "15px 30px",
    fontSize: "15px",
    backgroundColor: "#e6ccb2",
    color: "black",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    textAlign: "center",
  },
  button_container: {
    // padding: "0px 25px",
    display: "grid",
    gap: "15px",
  },
};

Search.propTypes = {
  handleClick: PropTypes.func.isRequired,
};

export default Search;
