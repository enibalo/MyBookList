import Header from "../components/Header";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import Link for navigation

const UserSettings = () => {
  const [username, setUsername] = useState(""); // Separate state for username
  const [availableGenres, setAvailableGenres] = useState([]); // Store genres from backend

  const [formData, setFormData] = useState({
    Genres: [],
  });

  const navigate = useNavigate(); // Initialize useNavigate for redirection

  useEffect(() => {
    // Fetch username dynamically from localStorage
    const storedUsername = localStorage.getItem("username");
    console.log("Stored username:", storedUsername); // Debugging
    if (storedUsername) {
      setUsername(storedUsername); // Update the username state dynamically
    }
  }, []);

  
  const handleLogout = () => {
    localStorage.removeItem("username"); // Remove username from localStorage
    navigate("/"); // Redirect to login page
  };

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
      username,
      genres: formData.Genres,
    };

    try {
      const response = await fetch("http://localhost:8800/adminSettings", {
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
  const handleSubmitChangePassword = async (event) => {
    event.preventDefault();

    // Check if passwords match
    if (formData.Password !== formData.ConfirmPassword) {
      alert("Passwords do not match!");
      return; // Stop form submission
    }

    const payload = {
      username,
      password: formData.Password,
    };

    try {
      const response = await fetch("http://localhost:8800/adminSettings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Password updated successfully!");
      } else {
        console.error("Error updating password:", response.statusText);
        alert("Failed to update password.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while updating password.");
    }
  };

  return (
    <>
      <Header></Header>
      <div style={styles.body}>
        <h1 style={styles.h1}>
          {username ? `Hello, ${username}` : "Loading..."}{" "}
        </h1>

        <div style={styles.settingsContainer}>
          {/* Change Password Section */}
          <div style={styles.formSection}>
          
            <h2 style={styles.h2}>Change Password</h2>
            <form onSubmit={handleSubmitChangePassword}>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.Password}
                onChange={(e) =>
                  setFormData({ ...formData, Password: e.target.value })
                }
                style={styles.input}
              />
              <input
                type="password"
                name="confirm_password"
                placeholder="Confirm Password"
                value={formData.ConfirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, ConfirmPassword: e.target.value })
                }
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
      </div>
    </>
  );
};

const styles = {
  body: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center", // Center vertically
    alignItems: "center", // Center horizontally
    height: "100vh", // Make the container take the full viewport height    margin: 0,
    padding: "20px",
    backgroundColor: "#E7CDBB", // Light beige color

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
    backgroundColor: "#F3EAE0",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    width: "100%",
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
    backgroundColor: "#7F5539",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    borderRadius: "4px",
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
};

export default UserSettings;
