import React, { useState } from "react";
import SearchBar from "../components/SearchBar.jsx"; // Adjust the path if needed
import Header from "../components/Header.jsx";

function Browse() {
  // State to handle which button is clicked
  const [clickedButton, setClickedButton] = useState(null);

  // Button styles with click logic
  const buttonStyle = (buttonId) => ({
    width: "600px",
    height: "70px",
    padding: "20px",
    backgroundColor: clickedButton === buttonId ? "#dcd0e2" : "#eeeaf4", // Change color if clicked
    marginBottom: "50px",
    cursor: "pointer",
    transition: "background-color 0.3s ease", 
  });

  return (
    <div>
      <Header />
      <div>
        <SearchBar />
      </div>

      {/* New Section with Text and Buttons */}
      <br />
      <div style={{ marginLeft: "30px" }}>
        <p>Not sure what to search ... click an item below!</p>
        <br />
        <br />
        <div className="button-group">
          {/* Button 1 */}
          <button
            style={buttonStyle(1)} 
            onClick={() => setClickedButton(1)} 
          >
            <p>Title: A Brief History of Time <br /> Author: Stephen Hawking</p>
          </button>

          <br />

          {/* Button 2 */}
          <button
            style={buttonStyle(2)} // Pass unique button ID for differentiation
            onClick={() => setClickedButton(2)} // Set the clicked button
          >
            Title: The Lord of the Rings<br /> Author: J.R.R. Tolkien
          </button>

          <br />

          {/* Button 3 */}
          <button
            style={buttonStyle(3)} // Pass unique button ID for differentiation
            onClick={() => setClickedButton(3)} // Set the clicked button
          >
            Title: Dune <br /> Author: Frank Herbert
          </button>
        </div>
      </div>
    </div>
  );
}

export default Browse;



