import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

// make sure that boook summary text section is bigger lol. or adjustable.

const BookAdd = () => {
  const [username, setUsername] = useState(""); // Separate state for username
  const [formData, setFormData] = useState({
    ISBN: "",
    Title: "",
    SeriesName: "",
    BookOrder: "",
    Author: "",
    Publisher: "",
    Description: "",
    PurchaseLink: "",
    Genres: [],
    isFavourite: false, // Track favorite status
    //adminUsername: "",
  });

  //const [searchQuery, setSearchQuery] = useState("");
  //const [searchResults, setSearchResults] = useState([]);

  const [genres, setGenres] = useState([]); // Store all genres

  const handleLogout = () => {
    localStorage.removeItem("username"); // Remove username from localStorage
    navigate("/"); // Redirect to login page
  };

  useEffect(() => {
    // Fetch genres from the backend
    const fetchGenres = async () => {
      try {
        const response = await fetch("http://localhost:8800/main-genres");
        if (response.ok) {
          const fetchedGenres = await response.json();
          setGenres(fetchedGenres); // Update state with fetched genres
        } else {
          console.error("Failed to fetch genres:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    fetchGenres();
  }, []);

  const navigate = useNavigate(); // Initialize useNavigate for redirection

  useEffect(() => {
    // Fetch username dynamically from localStorage
    const storedUsername = localStorage.getItem("username");
    console.log("Stored username:", storedUsername); // Debugging
    if (storedUsername) {
      setUsername(storedUsername); // Update the username state dynamically
    }
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenreToggle = (genre) => {
    setFormData((prev) => ({
      ...prev,
      Genres: prev.Genres.includes(genre)
        ? prev.Genres.filter((g) => g !== genre)
        : [...prev.Genres, genre],
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      ISBN: formData.ISBN,
      Title: formData.Title,
      SeriesName: formData.SeriesName == "" ? undefined : formData.SeriesName,
      BookOrder: formData.BookOrder == "" ? undefined : formData.BookOrder,
      Fname: formData.Fname,
      Lname: formData.Lname,
      DOB: formData.DOB,
      Publisher: formData.Publisher,
      Phone: formData.Phone,
      Email: formData.Email,
      Description: formData.Description,
      PurchaseLink:
        formData.PurchaseLink == "" ? undefined : formData.PurchaseLink,
      isFavourite: formData.isFavourite,
      //adminUsername: formData.adminUsername,
      adminUsername: username,
      Genres: formData.Genres,
    };

    console.log(payload);

    try {
      const response = await fetch("http://localhost:8800/BookAdd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Book added successfully!");
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred while submitting the form.");
    }
  };

  // Filter genres based on Main_genre
  const fictionGenres = genres.filter((g) => g.Main_genre === "Fiction");
  const nonFictionGenres = genres.filter((g) => g.Main_genre === "Non-Fiction");

  return (
    <>
      <Header></Header>
      <div style={styles.body}>
        <h1 style={{ marginTop: "30px" }}>Hello, Admin</h1>
        <br />
        <h2>Add A Book</h2>
        <div style={styles.formContainer}>
          <form onSubmit={handleSubmit}>
            {/* Favorite Toggle */}
            <div style={{ position: "relative", cursor: "pointer" }}>
              {/* Hidden checkbox for accessibility */}
              <input
                type="checkbox"
                id="isFavourite"
                name="isFavourite"
                checked={formData.isFavourite} // Bind to the boolean value
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isFavourite: e.target.checked, // Update based on checkbox state
                  }))
                }
                style={{
                  position: "absolute",
                  opacity: 0,
                  width: "100%",
                  height: "100%",
                  cursor: "pointer",
                }}
              />
              {/* SVG Star Icon */}
              <label htmlFor="isFavourite">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 48 48"
                  fill={formData.isFavourite ? "#FFEC40" : "none"} // Change fill dynamically
                  xmlns="http://www.w3.org/2000/svg"
                  style={{
                    transition: "fill 0.3s ease", // Smooth transition
                  }}
                >
                  <path
                    d="M24 4L30.18 16.52L44 18.54L34 28.28L36.36 42.04L24 35.54L11.64 42.04L14 28.28L4 18.54L17.82 16.52L24 4Z"
                    stroke="#1E1E1E"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </label>
            </div>

            {/*<input
                type="text"
                name="adminUsername"
                placeholder="Your Username"
                value={formData.adminUsername}
                onChange={handleChange}
                required
                style={styles.input}
            />*/}

            <input
              type="text"
              name="ISBN"
              placeholder="ISBN"
              value={formData.ISBN}
              onChange={handleChange}
              required
              style={styles.input}
            />
            <input
              type="text"
              name="Title"
              placeholder="Title"
              value={formData.Title}
              onChange={handleChange}
              required
              style={styles.input}
            />
            {/* Side-by-Side Inputs */}
            <div style={styles.sideBySide}>
              <input
                type="text"
                name="SeriesName"
                placeholder="Series Name (if applicable)"
                value={formData.SeriesName} // Ensure this binds to the correct state
                onChange={handleChange}
                // required
                style={styles.input}
              />
              <select
                name="BookOrder"
                // required
                style={styles.input}
                value={formData.BookOrder} // Ensure this binds to the correct state
                onChange={handleChange} // This should update formData.BookOrder
              >
                <option value="">Select Book Order</option>
                {Array.from({ length: 10 }, (_, i) => i + 1).map((order) => (
                  <option key={order} value={order}>
                    {order}
                  </option>
                ))}
              </select>
            </div>

            {/* Add New Section, here is hinted search if author already exists in database do an error */}
            <div style={styles.genreSection}>
              <h3 style={{ marginBottom: "20px", marginTop: "20px" }}>
                Add Author{" "}
              </h3>
              <div style={styles.sideBySide}>
                <input
                  type="text"
                  name="Fname"
                  placeholder="First Name"
                  value={formData.Fname || ""}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
                <input
                  type="text"
                  name="Lname"
                  placeholder="Last Name"
                  value={formData.Lname || ""}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </div>

              <input
                type="date"
                name="DOB"
                placeholder="Date of Birth"
                value={formData.DOB || ""}
                onChange={handleChange}
                //required
                style={styles.input}
              />
              <h3 style={{ marginBottom: "20px", marginTop: "20px" }}>
                Add Publisher{" "}
              </h3>
              <div style={styles.sideBySide}>
                <input
                  type="text"
                  name="Publisher" // Ensure this matches the formData key
                  placeholder="Publisher"
                  value={formData.Publisher} // Ensure this binds to the correct state
                  onChange={handleChange}
                  required
                  style={styles.input}
                />

                <input
                  type="text"
                  name="Phone"
                  placeholder="Phone Number"
                  value={formData.Phone} // Ensure this binds to the correct state
                  onChange={handleChange}
                  //required
                  style={styles.input}
                />
              </div>
              <input
                type="text"
                name="Email"
                placeholder="Email"
                value={formData.Email} // Ensure this binds to the correct state
                onChange={handleChange}
                //required
                style={styles.input}
              />
            </div>

            <textarea
              type="text"
              name="Description"
              placeholder="Book Description"
              value={formData.Description}
              onChange={handleChange}
              required
              style={styles.textarea}
            ></textarea>

            {/* Dynamic Genres Section */}
            <div style={styles.genreSection}>
              <h3>Fiction</h3>
              <div style={styles.toggleGroup}>
                {fictionGenres.map((genre) => (
                  <div key={genre.Name} style={styles.toggle}>
                    <input
                      type="checkbox"
                      id={genre.Name.toLowerCase()}
                      name="genre[]"
                      value={genre.Name}
                      onChange={() => handleGenreToggle(genre.Name)}
                      checked={formData.Genres.includes(genre.Name)}
                      style={styles.checkbox}
                    />
                    <label
                      htmlFor={genre.Name.toLowerCase()}
                      style={{
                        ...styles.label,
                        backgroundColor: formData.Genres.includes(genre.Name)
                          ? "#2c2c2c"
                          : "#ddd",
                        color: formData.Genres.includes(genre.Name)
                          ? "#fff"
                          : "#000",
                      }}
                    >
                      {genre.Name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div style={styles.genreSection}>
              <h3>Non-Fiction</h3>
              <div style={styles.toggleGroup}>
                {nonFictionGenres.map((genre) => (
                  <div key={genre.Name} style={styles.toggle}>
                    <input
                      type="checkbox"
                      id={genre.Name.toLowerCase()}
                      name="genre[]"
                      value={genre.Name}
                      onChange={() => handleGenreToggle(genre.Name)}
                      checked={formData.Genres.includes(genre.Name)}
                      style={styles.checkbox}
                    />
                    <label
                      htmlFor={genre.Name.toLowerCase()}
                      style={{
                        ...styles.label,
                        backgroundColor: formData.Genres.includes(genre.Name)
                          ? "#2c2c2c"
                          : "#ddd",
                        color: formData.Genres.includes(genre.Name)
                          ? "#fff"
                          : "#000",
                      }}
                    >
                      {genre.Name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            {/* <div style={styles.genreSection}>
            <h3 style={{ marginBottom: "20px", marginTop: "20px" }}>Fiction</h3>
            <div style={styles.toggleGroup}>
              {[
                "Space Opera",
                "Mystery",
                "Fantasy",
                "Historical Romance",
                "Sci-fi",
                "Thriller",
                "Horror",
              ].map((genre) => (
                <div key={genre} style={styles.toggle}>
                  <input
                    type="checkbox"
                    id={genre.toLowerCase()}
                    name="genre[]"
                    value={genre.toLowerCase()}
                    onChange={() => handleGenreToggle(genre)}
                    checked={formData.Genres.includes(genre)}
                    style={styles.checkbox}
                  />
                  <label
                    htmlFor={genre.toLowerCase()}
                    style={{
                      ...styles.label,
                      backgroundColor: formData.Genres.includes(genre)
                        ? "#2c2c2c"
                        : "#ddd",
                      color: formData.Genres.includes(genre) ? "#fff" : "#000",
                    }}
                  >
                    {genre}
                  </label>
                </div>
              ))}
            </div>
          </div>


<div style={styles.genreSection}>
  <h3 style={{ marginBottom: "20px", marginTop: "20px" }}>Non-Fiction</h3>
  <div style={styles.toggleGroup}>
    {["History", "Biography", "Self-Help","Popular Science"].map((genre) => (
      <div key={genre} style={styles.toggle}>
        <input
          type="checkbox"
          id={genre.toLowerCase()}
          name="genre[]"
          value={genre.toLowerCase()}
          onChange={() => handleGenreToggle(genre)}
          checked={formData.Genres.includes(genre)} // Pre-check based on state
          style={styles.checkbox}
        />
        <label
          htmlFor={genre.toLowerCase()}
          style={{
            ...styles.label,
            backgroundColor: formData.Genres.includes(genre) ? "#2c2c2c" : "#ddd", // Dynamic color
            color: formData.Genres.includes(genre) ? "#fff" : "#000", // Dynamic text color
          }}
        >
          {genre}
        </label>
      </div>
    ))}
  </div>
</div> */}
            {/* Additional Inputs */}
            <input
              type="text"
              name="PurchaseLink"
              placeholder="Purchase Link"
              value={formData.PurchaseLink}
              onChange={handleChange}
              // required
              style={styles.input}
            />
            <button type="submit" style={styles.button}>
              Submit
            </button>
          </form>
          <button onClick={handleLogout} style={styles.logoutButton}>
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

const styles = {
  textarea: {
    minHeight: "150px",
    resize: "none",
    width: "calc(100% - 20px)",
    marginBottom: "10px",
    marginTop: "30px",
    padding: "12px",
    border: "1px solid #cccccc",
    borderRadius: "4px",
    fontSize: "14px",
    backgroundColor: "#f9f9f9",
    fontFamily: "inherit",
  },
  body: {
    fontFamily: "Arial, sans-serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    margin: 0,
  },
  formContainer: {
    marginTop: "50px",
    backgroundColor: "#F8F4F2", // White for the form background
    padding: "50px",
    borderRadius: "8px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
    width: "80%",
    maxWidth: "800px",
  },
  logoutButton: {
    padding: "10px 20px",
    backgroundColor: "#7F5539",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
  },
  input: {
    width: "calc(100% - 20px)",
    marginBottom: "10px",
    marginTop: "30px",
    padding: "12px",
    border: "1px solid #cccccc",
    borderRadius: "4px",
    fontSize: "14px",
    backgroundColor: "#f9f9f9",
    fontFamily: "inherit",
  },
  button: {
    width: "100%",
    padding: "15px",
    backgroundColor: "#7F5539",
    color: "#ffffff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: "20px",
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
    backgroundColor: "#ececec", // Subtle gray for inactive toggle
    borderRadius: "15px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "background-color 0.3s, color 0.3s",
    color: "#333333", // Dark text color for inactive toggle
  },
  labelSelected: {
    backgroundColor: "#2c2c2c", // Dark gray for selected toggle
    color: "#ffffff", // White text for selected toggle
  },
  sideBySide: {
    display: "flex",
    gap: "10px",
  },
  genreSection: {
    marginTop: "30px",
    marginBottom: "20px",
  },
};

export default BookAdd;
