import React from 'react';

function Login () {

    const handleSubmit = async(event) => {
        event.preventDefault();

        const login_data = new FormData(event.target);

        const log_in_data = {
            username: login_data.get("username"),
            password: login_data.get("password"),
        };
        try{
            const response = await fetch('http://localhost:5173/', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(log_in_data),
            });
            
            if(response.ok){ // successful log in brings you to browse page 
              const data = await response.json();
              alert(data.message);
              window.location.href = '/browse';

            }


        }

        catch{
            console.error('Error logging in:', error);
            alert('An error occurred. Please try again later.');
        }
    }

  // once the user is logged in they're immediately taken to the browse page 


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
        
          {/* Button for submitting the form */}
          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>
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
    backgroundColor: '#f7f7f7',
  },
  h1: {
    marginBottom: '20px',
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px',
  },
  input: {
    width: 'calc(100% - 20px)',
    marginBottom: '15px',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '14px',
  },
  button: {
    display: 'block',
    width: '100%',
    padding: '10px',
    backgroundColor: '#333',
    color: '#fff',
    textAlign: 'center',
    borderRadius: '4px',
    border: 'none',
    fontSize: '16px',
    cursor: 'pointer',
  },
};

export default Login;


