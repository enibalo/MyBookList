import React, { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar.jsx"; // Adjust the path if needed
import Header from "../components/Header.jsx"; 

function Browse() {
  // fetch the list of books from the backend and their attributes

  const [books, setBooks] = useState ([])

  useEffect(()=>{
    const fetchAllBooks = async()=>{
      try{
        const results = await fetch("http://localhost:8800/books");
        const data = await results.json(); 
        setBooks(data);       
      }
      catch(error){
        console.error("Error fetching books:", error); 
      }
    };

    fetchAllBooks(); 

  }, []); 

  
  

return (

  <div>
    <Header/>
    <h1 style={styles.h2}>Browse Books</h1>

    <div style={styles.searchBarContainer}> 
    <SearchBar style={styles.SearchBar} />
    </div>


    <div>
      <p style={styles.p}>Not sure what to search? Choose a book below!</p>
    </div>

    <div style={styles.button_container}>
    <br></br>
    {books.map((book) => (
    
    <div key={book.ISBN}>
      <a href="/book/:${{book.ISBN}}" style={styles.signupLink}>
      <button style={styles.button}>
        Title: {book.Title} 
        <br />

      </button>
      </a>
    </div>


    ))}
    </div>


  </div>

); 


}

const styles = {
  h2: {
    textAlign: "center", // Correct alignment for text
    fontFamily: "Arial, sans-serif",
  },

  searchBarContainer: {
    display: "flex",         // Enable flexbox
    justifyContent: "center", // Horizontally center
    alignItems: "center",     // Vertically center (if needed)
    marginTop: "20px",       // Optional: Add spacing between header and search bar
  },

  p:{
    textAlign:"center",
    marginTop: "10px", 
  }, 



  button: {
    padding: "15px 30px",      // Adjust padding for a larger button
    fontSize: "15px",          // Make the text larger
    backgroundColor: "#9c6644", // Green background (you can change this)
    color: "balck",            // White text color
    border: "none",            // Remove default border
    borderRadius: "5px",       // Rounded corners
    cursor: "pointer",         // Pointer cursor on hover
    width: "200px",            // Fixed width (optional)
    textAlign: "center",       // Center the text inside the button
    marginBottom: "40px",       // Add space between buttons
  },

  button_container: {
    display: "flex",              // Use flexbox
    justifyContent: "center",     // Center buttons horizontally
    alignItems: "center",         // Center buttons vertically
    MinHeight: "100vh",           // Make the container take the full height of the viewport
    MinWidth: "100vh", 
    flexDirection: "column",      // Stack buttons vertically (optional)
  },
  
};



export default Browse;



