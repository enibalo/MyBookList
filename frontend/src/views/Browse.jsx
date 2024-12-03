import React, { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar.jsx"; // Adjust the path if needed
import Header from "../components/Header.jsx";
import { Link } from "react-router-dom";

function Browse() {
  const [books, setBooks] = useState([]); // Full list of books
  const [filteredBooks, setFilteredBooks] = useState([]); // Filtered books for display
  const [searchTerm, setSearchTerm] = useState(""); // Current search term

  useEffect(() => {
    const fetchAuthorName = async (authorId) => {
      try {
        const response = await fetch(
          `http://localhost:8800/author/${authorId}`
        );
        const authorData = await response.json();
        return `${authorData.Fname} ${authorData.Lname}`;
      } catch (error) {
        console.error("Error fetching author:", error);
        return "Unknown Author";
      }
    };

    const fetchAllBooks = async () => {
      try {
        const results = await fetch("http://localhost:8800/books");
        const data = await results.json();

        // Update books with the author names
        const booksWithAuthors = await Promise.all(
          data.map(async (book) => {
            const authorName = await fetchAuthorName(book.Author_id);
            return { ...book, authorName }; // Add authorName to each book
          })
        );

        setBooks(booksWithAuthors);
        setFilteredBooks(booksWithAuthors); // Initially display all books
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchAllBooks();
  }, []);

  const handleSearch = (value) => {
    setSearchTerm(value); // Update search term as the user types
  };

  const handleSearchSubmit = () => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    const results = books.filter(
      (book) =>
        book.Title.toLowerCase().includes(lowerSearchTerm) ||
        book.authorName.toLowerCase().includes(lowerSearchTerm)
    );
    setFilteredBooks(results); // Update displayed books
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
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
            <div key={book.ISBN}>
              <Link to={"../book/" + book.ISBN} style={styles.signupLink}>
                <button style={styles.button}>
                  <span style={{ fontWeight: "bold" }}>Title:</span>{" "}
                  {book.Title}
                  <br />
                  <span style={{ fontWeight: "bold" }}>Author: </span>{" "}
                  {book.authorName}
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
   background:{
    backgroundColor: "#ede0d4", 
   }, 

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

  no_books_found:{
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
  },
  button_container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    flexDirection: "column",
  },
};

export default Browse;
