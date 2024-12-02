import React, { useState } from "react";

function Login() {
  const [errorMessage, setErrorMessage] = useState(""); // Define error message state

  const handleSubmit = async (event) => {
    event.preventDefault();

    const login_data = new FormData(event.target);

    const log_in_data = {
      username: login_data.get("username"),
      password: login_data.get("password"),
    };

    try {
      const response = await fetch("http://localhost:8800/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(log_in_data),
      });

      if (response.ok) {
        const data = await response.json();
        // Save the username to localStorage
        localStorage.setItem("username", log_in_data.username);

        if (data.role === "admin") {
          // Redirect to admin page if admin
          window.location.href = "http://localhost:5173/addBook";
        }
        // Successful login
        else {
          window.location.href = "http://localhost:5173/browse"; // Redirect to browse page
        }
      } else {
        // Handle case where username/password doesn't match
        setErrorMessage(
          "Username or password is incorrect. Please try again or create a new account."
        );
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <div style={styles.body}>
      <h1 style={styles.h1}>My BookList</h1>
      <div style={styles.formContainer}>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            required
            style={styles.input}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            style={styles.input}
          />

          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        <div style={styles.signupLinkContainer}>
          <br></br>
          <p>
            Don't have an account?{" "}
            <a href="/signup" style={styles.signupLink}>
              Sign up here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

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
  h1: {
    marginBottom: "20px",
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
    display: "block",
    width: "100%",
    padding: "10px",
    backgroundColor: "#333",
    color: "#fff",
    textAlign: "center",
    borderRadius: "4px",
    border: "none",
    fontSize: "16px",
    cursor: "pointer",
  },
};

export default Login;
