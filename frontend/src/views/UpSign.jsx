import React from 'react';

const UpSign = () => {
  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = {
      username: formData.get("username"),
      password: formData.get("password"),
      confirm_password: formData.get("confirm_password"),
      book_title: formData.get("book_title"),
      recommendation: formData.get("recommendation"),
    };

    // Check if passwords match
    if (data.password !== data.confirm_password) {
      alert("Passwords do not match!");
      return;
    }

    try {
        const response = await fetch("http://localhost:8800/UpSign", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: data.username, password: data.password }),
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
      <h1 style={styles.h1}>My Book List</h1>
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
          <input
            type="password"
            name="confirm_password"
            placeholder="Confirm Password"
            required
            style={styles.input}
          />
          <button type="submit" style={styles.link}>
            Submit
          </button>
        </form>
        <p style={styles.loginPrompt}>
          Already have an account?{' '}
          <a href="/" style={styles.loginLink}>
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

const styles = {
  body: {
    fontFamily: 'Arial, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    margin: 0,
    backgroundColor: '#f8f4ec',
  },
  h1: {
    marginBottom: '20px',
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: '80px',
    borderRadius: '8px',
    boxShadow: '0 2px 15px rgba(0, 0, 0, 0.2)', // Adjusted shadow for better visibility
    width: '80%',
    maxWidth: '800px',
  },
  input: {
    width: 'calc(100% - 20px)',
    marginBottom: '15px',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '14px',
  },
  link: {
    display: 'block',
    marginTop: '15px',
    padding: '10px',
    backgroundColor: '#7F5539',
    color: '#fff',
    textAlign: 'center',
    borderRadius: '4px',
    textDecoration: 'none',
    fontSize: '16px',
    cursor: 'pointer',
  },
  loginPrompt: {
    marginTop: '30px', // Add more spacing above the login prompt
    fontSize: '14px',
    textAlign: 'center',
  },
  loginLink: {
    color: '#7F5539',
    textDecoration: 'underline',
    cursor: 'pointer',
  },
};

export default UpSign;
