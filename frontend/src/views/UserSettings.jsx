import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation

const UserSettings = () => {
  const [formData, setFormData] = useState({
    Genres: [],
    Username: "novelguy", // Replace with dynamic username if needed
  });

  const handleGenreToggle = (genre) => {
    setFormData((prev) => ({
      ...prev,
      Genres: prev.Genres.includes(genre)
        ? prev.Genres.filter((g) => g !== genre)
        : [...prev.Genres, genre],
    }));
  };

  const handleSubmitGenres = async (event) => {
    event.preventDefault();

    const payload = {
      username: formData.Username,
      genres: formData.Genres,
    };

    try {
      const response = await fetch("http://localhost:8800/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Genres updated successfully!");
      } else {
        console.error("Error updating genres:", response.statusText);
        alert("Failed to update genres.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while updating genres.");
    }
  };

  return (
    <div style={styles.body}>
      <h1 style={styles.h1}>Hello, {formData.Username}</h1>
      <div style={styles.settingsContainer}>
        {/* Change Password Section */}
        <div style={styles.formSection}>
          {/* <h2 style={styles.h2}>Settings</h2>
          <Link to="/addBook" style={styles.button}>
            Go to Add Book
          </Link>
          */}
          <h2 style={styles.h2}>Change Password</h2>
          <form action="/change-password" method="POST">
            <input
              type="password"
              name="password"
              placeholder="Password"
              style={styles.input}
            />
            <input
              type="password"
              name="confirm_password"
              placeholder="Confirm Password"
              style={styles.input}
            />
            <button type="submit" style={styles.button}>
              Submit
            </button>
          </form>
        </div>

        {/* Select Genres Section */}
        <div style={styles.formSection}>
          <h2 style={styles.h2}>Select Your Favorite Genres</h2>
          <form onSubmit={handleSubmitGenres}>
            <div style={styles.genres}>
              {[
                "Fiction",
                "Mystery",
                "Fantasy",
                "Sci-Fi",
                "Biography",
                "Romance",
                "Horror",
                "Non-Fiction",
                "History",
                "Thriller",
              ].map((genre) => (
                <div
                  key={genre}
                  style={{
                    ...styles.genre,
                    ...(formData.Genres.includes(genre)
                      ? styles.genreSelected
                      : {}),
                  }}
                  onClick={() => handleGenreToggle(genre)}
                >
                  {genre}
                </div>
              ))}
            </div>
            <button type="submit" style={styles.button}>
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const styles = {
  body: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    margin: 0,
    padding: "20px",
    backgroundColor: "#f7f7f7",
  },
  h1: {
    marginBottom: "30px",
  },
  settingsContainer: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    maxWidth: "800px",
  },
  formSection: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    width: "48%",
  },
  h2: {
    marginBottom: "15px",
  },
  input: {
    marginBottom: "15px",
    width: "calc(100% - 20px)",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "14px",
  },
  button: {
    marginTop: "20px",
    marginBottom: "15px",
    width: "calc(100% - 20px)",
    padding: "10px",
    backgroundColor: "#333",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    borderRadius: "4px",
  },
  genres: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
  },
  genre: {
    display: "inline-block",
    padding: "5px 10px",
    backgroundColor: "#ddd",
    borderRadius: "4px",
    cursor: "pointer",
    userSelect: "none",
  },
  genreSelected: {
    backgroundColor: "#333",
    color: "#fff",
  },
};

export default UserSettings;
