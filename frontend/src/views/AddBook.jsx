import React, { useState } from "react";

const AddBook = () => {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [publisherSuggestions, setPublisherSuggestions] = useState([]);
  const [authorSuggestions, setAuthorSuggestions] = useState([]);

  const handleGenreToggle = (genre) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const handleSearch = (query, setSuggestions) => {
    // Mock search functionality (replace with API call if needed)
    const suggestions = ["Example 1", "Example 2", "Example 3"].filter((item) =>
      item.toLowerCase().includes(query.toLowerCase())
    );
    setSuggestions(suggestions);
  };

  return (
    <div style={styles.body}>
      <h1>Hello, Admin</h1>
      <h2>Add A Book</h2>
      <div style={styles.formContainer}>
        <form action="/submit-book" method="POST">
          {/* Favorite Toggle */}
          <div style={styles.toggleGroup}>
            <div style={styles.toggle}>
              <input
                type="checkbox"
                id="favourite"
                name="genre[]"
                value="favourite"
                style={styles.checkbox}
              />
              <label htmlFor="favourite" style={styles.label}>
                Favourite
              </label>
            </div>
          </div>

          {/* Text Inputs */}
          <input
            type="text"
            name="isbn"
            placeholder="ISBN"
            required
            style={styles.input}
          />
          <input
            type="text"
            name="title"
            placeholder="Title"
            required
            style={styles.input}
          />

          {/* Side-by-Side Inputs */}
          <div style={styles.sideBySide}>
            <input
              type="text"
              name="series-name"
              placeholder="Series Name (if applicable)"
              required
              style={styles.input}
            />
            <select name="book-order" required style={styles.input}>
              <option value="">Select Book Order</option>
              {Array.from({ length: 10 }, (_, i) => i + 1).map((order) => (
                <option key={order} value={order}>
                  {order}
                </option>
              ))}
            </select>
          </div>

          {/* Search Sections */}
          <div style={styles.genreSection}>
            <h3>Search Existing (Publisher/Author)</h3>
            {/* Publisher Search */}
            <input
              type="text"
              placeholder="Type to search Publisher..."
              onChange={(e) =>
                handleSearch(e.target.value, setPublisherSuggestions)
              }
              style={styles.input}
            />
            <div style={styles.suggestions}>
              {publisherSuggestions.map((suggestion, idx) => (
                <div key={idx} style={styles.suggestion}>
                  {suggestion}
                </div>
              ))}
            </div>
            {/* Author Search */}
            <input
              type="text"
              placeholder="Type to search Author..."
              onChange={(e) =>
                handleSearch(e.target.value, setAuthorSuggestions)
              }
              style={styles.input}
            />
            <div style={styles.suggestions}>
              {authorSuggestions.map((suggestion, idx) => (
                <div key={idx} style={styles.suggestion}>
                  {suggestion}
                </div>
              ))}
            </div>
          </div>

          {/* Add New Section */}
          <div style={styles.genreSection}>
            <h3>Add New (Publisher/Author)</h3>
            <input
              type="text"
              name="author"
              placeholder="Author"
              required
              style={styles.input}
            />
            <input
              type="text"
              name="publisher"
              placeholder="Publisher"
              required
              style={styles.input}
            />
          </div>

          {/* Additional Inputs */}
          <input
            type="text"
            name="description"
            placeholder="Book Description"
            required
            style={styles.input}
          />
          <input
            type="text"
            name="purchase_link"
            placeholder="Purchase Link"
            required
            style={styles.input}
          />

          {/* Genre Toggles */}
          <div style={styles.genreSection}>
            <h3>Fiction</h3>
            <div style={styles.toggleGroup}>
              {["Romance", "Mystery", "Fantasy"].map((genre) => (
                <div key={genre} style={styles.toggle}>
                  <input
                    type="checkbox"
                    id={genre.toLowerCase()}
                    name="genre[]"
                    value={genre.toLowerCase()}
                    onChange={() => handleGenreToggle(genre)}
                    style={styles.checkbox}
                  />
                  <label htmlFor={genre.toLowerCase()} style={styles.label}>
                    {genre}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.genreSection}>
            <h3>Non-Fiction</h3>
            <div style={styles.toggleGroup}>
              {["History", "Biography", "Self-Help"].map((genre) => (
                <div key={genre} style={styles.toggle}>
                  <input
                    type="checkbox"
                    id={genre.toLowerCase()}
                    name="genre[]"
                    value={genre.toLowerCase()}
                    onChange={() => handleGenreToggle(genre)}
                    style={styles.checkbox}
                  />
                  <label htmlFor={genre.toLowerCase()} style={styles.label}>
                    {genre}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" style={styles.button}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  body: {
    fontFamily: "Arial, sans-serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    margin: 0,
    backgroundColor: "#f7f7f7",
  },
  formContainer: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "400px",
  },
  input: {
    width: "calc(100% - 20px)",
    marginBottom: "15px",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "14px",
  },
  button: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#333",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
  },
  toggleGroup: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginBottom: "20px",
  },
  toggle: {
    display: "flex",
    alignItems: "center",
  },
  checkbox: {
    display: "none",
  },
  label: {
    padding: "5px 10px",
    backgroundColor: "#ddd",
    borderRadius: "15px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "background-color 0.3s, color 0.3s",
  },
  sideBySide: {
    display: "flex",
    gap: "10px",
  },
  genreSection: {
    marginBottom: "20px",
  },
  suggestions: {
    position: "relative",
    backgroundColor: "#fff",
    border: "1px solid #ccc",
    borderRadius: "4px",
    maxHeight: "200px",
    overflowY: "auto",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    zIndex: 1000,
  },
  suggestion: {
    padding: "10px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "background-color 0.2s",
  },
};

export default AddBook;
