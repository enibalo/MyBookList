import { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar.jsx"; // Adjust the path if needed
import Header from "../components/Header.jsx";
import { Link } from "react-router-dom";

//fix search styling
function Browse() {
  const [books, setBooks] = useState([]); // Books displayed on the page
  const [searchTerm, setSearchTerm] = useState(""); // Current search term
  const [allBooks, setAllBooks] = useState([]); // All books to show when no search is active

  // Function to fetch books based on the search term or fetch all books
  const fetchBooks = async (term = "") => {
    try {
      const query = term ? `?q=${encodeURIComponent(term)}` : "";
      const response = await fetch(
        `http://localhost:8800/search/browse${query}`
      );
      const data = await response.json();
      setBooks(data); // Update displayed books
    } catch (error) {
      console.error("Error fetching books:", error);
      setBooks([]); // Clear books on error
    }
  };

  // Fetch all books on initial load
  useEffect(() => {
    const fetchAllBooks = async () => {
      try {
        const response = await fetch("http://localhost:8800/books");
        const data = await response.json();
        setAllBooks(data); // Store all books
        setBooks(data); // Display all books initially
      } catch (error) {
        console.error("Error fetching all books:", error);
        setBooks([]); // Clear books on error
      }
    };

    fetchAllBooks();
  }, []);

  const handleSearch = (value) => {
    setSearchTerm(value); // Update search term as the user types
  };

  const handleSearchSubmit = () => {
    if (searchTerm) {
      fetchBooks(searchTerm); // Fetch books matching the search term
    } else {
      setBooks(allBooks); // If no search term, display all books
    }
  };

  return (
    <div style={styles.background}>
      <div>
        <Header />
        <h1 style={styles.h2}>Browse Books</h1>

        <div style={styles.searchBarContainer}>
          <SearchBar
            style={styles.SearchBar}
            onSearch={handleSearch}
            onSearchSubmit={handleSearchSubmit}
          />
        </div>

        <div>
          <p style={styles.p}>Not sure what to search? Choose a book below!</p>
        </div>

        <div style={styles.button_container}>
          <br />
          {books.length > 0 ? (
            books.map((book) => (
              <div key={book.ISBN}>
                <Link to={"../book/" + book.ISBN} style={styles.signupLink}>
                  <button style={styles.button}>
                    <span style={{ fontWeight: "bold" }}>Title:</span>{" "}
                    {book.Title}
                    <br />
                    <span style={{ fontWeight: "bold" }}>Author: </span>{" "}
                    {book.AuthorName}
                    <br />
                  </button>
                </Link>
              </div>
            ))
          ) : (
            <p style={styles.no_books_found}>No books found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  h2: {
    padding: "40px",
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
  },
  searchBarContainer: {
    display: "flex",
    justifyContent: "center",
    marginTop: "20px",
  },
  p: {
    padding: "40px",
    textAlign: "center",
    marginTop: "10px",
  },
  no_books_found: {
    marginBottom: "500px",
  },
  button: {
    padding: "15px 30px",
    fontSize: "20px",
    backgroundColor: "#e6ccb2",
    color: "black",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    width: "500px",
    height: "100px",
    textAlign: "center",
    marginBottom: "40px",
    fontFamily: "inherit",
  },
  button_container: {
    display: "flex",
    alignItems: "center",
    minHeight: "100vh",
    flexDirection: "column",
  },
};

export default Browse;
