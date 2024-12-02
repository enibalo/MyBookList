import express from "express";
import mysql from "mysql";
import cors from "cors";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
require("dotenv").config({ path: "./.env" });
const { query, validationResult } = require("express-validator");

const app = express();
app.use(cors());
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" })); // Allow Vite frontend

// Database connection
const db = mysql.createConnection({
  host: "localhost", // Update this with your database host
  user: "root",      // Update with your database username
  password: "Nizamani123",      // Update with your database password
  database: "My_book_list" // Database name
});

// Connect to database
db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the database!");
});

// API endpoint for form submission
//add the thing to make sure passwordsMatch Lol
app.post("/UpSign", (req, res) => {
  const { username, password, book_title, recommendation } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  // Check if the username already exists
  const checkUserQuery = "SELECT * FROM User WHERE Username = ?";
  db.query(checkUserQuery, [username], (err, results) => {
    if (err) {
      console.error("Error checking for existing username:", err);
      return res.status(500).json({ message: "Database error." });
    }

    if (results.length > 0) {
      return res.status(400).json({ message: "Username already exists. Please choose a different one." });
    }

    // Insert user into `User` table
    const userQuery = "INSERT INTO `User` (Username, Password) VALUES (?, ?)";
    db.query(userQuery, [username, password], (err, result) => {
      if (err) {
        console.error("Error inserting into User table:", err);
        return res.status(500).json({ message: "Database error." });
      }

      console.log("User inserted:", username);

      /* Insert book and recommendation into the database
      const randomISBN = Math.floor(1000000 + Math.random() * 9000000); // Generate random ISBN
      const recommendationQuery = `
        INSERT INTO Recommendation (Username, Book_isbn, Recommended_isbn, Comment )
        VALUES (?, ?, '0000000000000', ?)
      `;
      db.query(recommendationQuery, [username, randomISBN, recommendation], (err, result) => {
        if (err) {
          console.error("Error inserting into Recommendation table:", err);
          return res.status(500).json({ message: "Database error in recommendation." });
        }

        res.status(200).json({ message: "Form submitted successfully!" });
      });*/
    });
  });
});

app.post("/BookAdd", (req, res) => {
  const {
    ISBN,
    Title,
    SeriesName,
    BookOrder,
    Fname,
    Lname,
    DOB,
    Publisher,
    Phone,
    Email,
    Description,
    PurchaseLink,
    isFavourite,
    adminUsername,
    Genres,
  } = req.body;

 // Check for missing fields and construct a detailed error message
const missingFields = [];
if (!ISBN) missingFields.push("ISBN");
if (!Title) missingFields.push("Title");
if (!Fname) missingFields.push("First Name (Fname)");
if (!Lname) missingFields.push("Last Name (Lname)");
if (!Publisher) missingFields.push("Publisher");
if (!Genres || Genres.length === 0) missingFields.push("At least one genre selection");

if (missingFields.length > 0) {
  return res.status(400).json({
    message: `The following required fields are missing: ${missingFields.join(", ")}`,
  });
}


  // Normalize inputs
  const normalizedPublisher = Publisher.trim();
  const normalizedFname = Fname.trim();
  const normalizedLname = Lname.trim();

  // Helper function to insert the book
  const insertBook = (authorId) => {
    const insertBookQuery = `
      INSERT INTO Book (ISBN, Title, Purchase_link, Author_id, Publisher_name, Summary)
      VALUES (?, ?, ?, ?, ?, ?)`;
    db.query(insertBookQuery, [ISBN, Title, PurchaseLink, authorId, normalizedPublisher, Description], async (err) => {
      if (err) {
        console.error("Error inserting book:", err);
        return res.status(500).json({ message: "Database error while inserting book." });
      }
      res.status(200).json({ message: "Book added successfully!" });

      if (SeriesName && BookOrder) {
        const insertSeriesQuery = `
          INSERT INTO Book_series (Book_isbn, Series_name, Book_order)
          VALUES (?, ?, ?)`;
  
        db.query(insertSeriesQuery, [ISBN, SeriesName, BookOrder], (seriesErr) => {
          if (seriesErr) {
            console.error("Error inserting into Book_series:", seriesErr);
            return res.status(500).json({ message: "Database error while inserting into Book_series." });
          }
          console.log("Book series added successfully!");
        });
      }
      // Handle Favorites: Only if isFavourite is true
      if (isFavourite) {
        const insertFavoriteQuery = `
          INSERT INTO Favorites (Username, Book_isbn)
          VALUES (?, ?)
          ON DUPLICATE KEY UPDATE Book_isbn = VALUES(Book_isbn);
        `;
      
        db.query(insertFavoriteQuery, [adminUsername, ISBN], (favErr) => {
          if (favErr) {
            console.error("Error inserting into Favorites:", favErr);
            return res.status(500).json({ message: "Database error while updating favorites." });
          }
          console.log("Favorite status updated successfully!");
        });
      }

      try {
        await insertGenres(); // Call the insertGenres function
        console.log("Genres added successfully!");
      } catch (err) {
        console.error("Error inserting genres:", err);
        res.status(500).json({ message: "Database error while inserting genres." });
      }
    });
  };

  // Function to insert genres
const insertGenres = () => {
  if (Genres && Genres.length > 0) {
    const genreQueries = Genres.map((genre) => {
      return new Promise((resolve, reject) => {
        db.query(
          "INSERT INTO Posseses (Book_isbn, Genre_name) VALUES (?, ?) ON DUPLICATE KEY UPDATE Genre_name = Genre_name",
          [ISBN, genre],
          (err) => {
            if (err) {
              console.error(`Error inserting genre: ${genre}`, err);
              reject(err);
            } else {
              console.log(`Genre added: ${genre}`);
              resolve();
            }
          }
        );
      });
    });

    return Promise.all(genreQueries);
  } else {
    console.log("No genres to add.");
    return Promise.resolve();
  }
};

  // Step 1: Check if the author exists
  const checkAuthorQuery = `SELECT ID FROM Author WHERE Fname = ? AND Lname = ? AND DOB = ?`;
  db.query(checkAuthorQuery, [normalizedFname, normalizedLname, DOB], (err, authorResults) => {
    if (err) {
      console.error("Error checking author:", err);
      return res.status(500).json({ message: "Database error while checking author." });
    }

    let authorId;

    const handlePublisher = () => {
      // Use INSERT IGNORE to add the publisher only if it doesn't exist
      const insertPublisherQuery = `INSERT IGNORE INTO Publisher (Name, Email, Phone) VALUES (?, ?, ?)`;
      db.query(insertPublisherQuery, [normalizedPublisher, Email, Phone], (err) => {
        if (err) {
          console.error("Error inserting publisher:", err);
          return res.status(500).json({ message: "Database error while inserting publisher." });
        }
        console.log("Publisher verified/added:", normalizedPublisher);
        insertBook(authorId);
      });
    };

    if (authorResults.length > 0) {
      // Author exists
      authorId = authorResults[0].ID;
      handlePublisher();
    } else {
      // Insert new author
      const insertAuthorQuery = `INSERT INTO Author (Fname, Lname, DOB) VALUES (?, ?, ?)`;
      db.query(insertAuthorQuery, [normalizedFname, normalizedLname, DOB], (err, authorInsertResult) => {
        if (err) {
          console.error("Error inserting author:", err);
          return res.status(500).json({ message: "Database error while inserting author." });
        }
        authorId = authorInsertResult.insertId;
        handlePublisher();
      });
    }
  });
});

app.post("/settings", (req, res) => {
  const { username, genres } = req.body;

  // Validate incoming data
  if (!username || !genres || !Array.isArray(genres)) {
    return res.status(400).send("Invalid data. Ensure username and genres are provided.");
  }

  // Delete existing genres for the user
  const deleteQuery = "DELETE FROM Likes WHERE Username = ?";
  db.query(deleteQuery, [username], (deleteErr) => {
    if (deleteErr) {
      console.error("Error deleting genres:", deleteErr.message);
      return res.status(500).send("Error removing existing genres.");
    }

    // If no genres are selected, return success after deletion
    if (genres.length === 0) {
      console.log("Genres cleared successfully for username:", username);
      return res.send("Genres cleared successfully.");
    }

    // Prepare the data for insertion
    const values = genres.map((genre) => [username, genre]);
    console.log("Prepared values for insertion:", values);

    // Insert new genres
    const insertQuery = "INSERT INTO Likes (Username, Genre_name) VALUES ?";
    db.query(insertQuery, [values], (insertErr) => {
      if (insertErr) {
        console.error("Error inserting genres:", insertErr.message);

        // Specific logging for foreign key constraint violations
        if (insertErr.code === "ER_NO_REFERENCED_ROW_2") {
          return res.status(400).send("One or more genres do not exist in the Genre table.");
        }

        return res.status(500).send("Failed to add genres.");
      }

      console.log("Genres added successfully for username:", username);
      res.send("Genres updated successfully!");
    });
  });
});





app.post("/BooookAdd", (req, res) => {
  const {
    ISBN,
    Title,
    SeriesName,
    BookOrder,
    Fname,
    Lname,
    DOB,
    Publisher,
    Phone,
    Email,
    Description,
    PurchaseLink,
  } = req.body;

  // Step 1: Check if the author exists
  const checkAuthorQuery = `SELECT ID FROM Author WHERE Fname = ? AND Lname = ? AND DOB = ?`;
  db.query(checkAuthorQuery, [Fname, Lname, DOB], (err, authorResults) => {
    if (err) {
      console.error("Error checking author:", err);
      return res.status(500).json({ message: "Database error while checking author." });
    }

    const handlePublisherAndBookInsertion = (authorId) => {
      // Step 2: Check if the publisher exists
      const checkPublisherQuery = `SELECT Name FROM Publisher WHERE Name = ?`;
      db.query(checkPublisherQuery, [Publisher], (err, publisherResults) => {
        if (err) {
          console.error("Error checking publisher:", err);
          return res.status(500).json({ message: "Database error while checking publisher." });
        }

        const insertBook = () => {
          // Step 3: Insert the book
          const insertBookQuery = `
            INSERT INTO Book (ISBN, Title, Purchase_link, Author_id, Publisher_name, Summary)
            VALUES (?, ?, ?, ?, ?, ?)`;
          db.query(
            insertBookQuery,
            [ISBN, Title, PurchaseLink, authorId, Publisher, Description],
            (err) => {
              if (err) {
                console.error("Error inserting book:", err);
                return res.status(500).json({ message: "Database error while inserting book." });
              }
              res.status(200).json({ message: "Book added successfully!" });
            }
          );
        };

        if (publisherResults.length > 0) {
          // Publisher exists
          insertBook();
        } else {
          // Insert new publisher
          const insertPublisherQuery = `INSERT INTO Publisher (Name, Email, Phone) VALUES (?, ?, ?)`;
          db.query(insertPublisherQuery, [Publisher, Email, Phone], (err) => {
            if (err) {
              console.error("Error inserting publisher:", err);
              return res.status(500).json({ message: "Database error while inserting publisher." });
            }
            insertBook();
          });
        }
      });
    };

    if (authorResults.length > 0) {
      // Author exists, proceed to the publisher and book insertion
      handlePublisherAndBookInsertion(authorResults[0].ID);
    } else {
      // Insert new author
      const insertAuthorQuery = `INSERT INTO Author (Fname, Lname, DOB) VALUES (?, ?, ?)`;
      db.query(insertAuthorQuery, [Fname, Lname, DOB], (err, authorInsertResult) => {
        if (err) {
          console.error("Error inserting author:", err);
          return res.status(500).json({ message: "Database error while inserting author." });
        }
        handlePublisherAndBookInsertion(authorInsertResult.insertId);
      });
    }
  });
});


  // Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
