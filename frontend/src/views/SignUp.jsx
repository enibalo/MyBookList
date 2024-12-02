import React from "react";

const SignUp = () => {
  /*const handleSubmit = (event) => {
    event.preventDefault(); // Prevents the default form submission behavior
    document.querySelector('form').submit();
  };*/
  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = {
      username: formData.get("username"),
      password: formData.get("password"),
      book_title: formData.get("book_title"),
      recommendation: formData.get("recommendation"),
    };

    try {
      const response = await fetch("http://localhost:8800/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("Form submitted successfully!");
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred while submitting the form.");
    }
  };

  return (
    <div style={styles.body}>
      <h1 style={styles.h1}>My BookList</h1>
      <div style={styles.formContainer}>
        <form action="/submit" method="POST">
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
          <input
            type="password"
            name="confirm_password"
            placeholder="Confirm Password"
            required
            style={styles.input}
          />
          <input
            type="text"
            name="book_title"
            placeholder="Book Title"
            required
            style={styles.input}
          />
          <input
            type="text"
            name="recommendation"
            placeholder="Recommendation"
            required
            style={styles.input}
          />
          <a href="#" onClick={handleSubmit} style={styles.link}>
            Login
          </a>
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
  link: {
    display: "block",
    marginTop: "15px",
    padding: "10px",
    backgroundColor: "#333",
    color: "#fff",
    textAlign: "center",
    borderRadius: "4px",
    textDecoration: "none",
    fontSize: "16px",
    cursor: "pointer",
  },
};

export default SignUp;
