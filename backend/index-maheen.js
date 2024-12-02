import express from "express";
import mysql from "mysql";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" })); // Allow Vite frontend

// Database connection
const db = mysql.createConnection({
  host: "localhost", // Update this with your database host
  user: "root",      // Update with your database username
  password: "Nizamani123",  // Update with your database password
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

app.get("/user-genres/:username", (req, res) => {
  const { username } = req.params;
  const query = `SELECT Genre_name FROM Likes WHERE Username = ?`;

  db.query(query, [username], (err, results) => {
    if (err) {
      console.error("Error fetching user genres:", err);
      return res.status(500).json({ message: "Database error." });
    }
    const userGenres = results.map((row) => row.Genre_name);
    console.log("User genres fetched:", userGenres); // Log the fetched genres
    res.json(userGenres);
  });
});

app.get("/genres", (req, res) => {
  const fetchGenresQuery = "SELECT Name FROM Genre";
  db.query(fetchGenresQuery, (err, results) => {
    if (err) {
      console.error("Error fetching genres:", err.message);
      return res.status(500).send("Failed to fetch genres.");
    }
    // Map results to a simple array of genre names
    res.json(results.map((row) => row.Name));
  });
});

app.get("/main-genres", (req, res) => {
  const query = "SELECT Name, Main_genre FROM Genre";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching genres:", err.message);
      return res.status(500).send("Failed to fetch genres.");
    }

    res.json(results); // Send all genres with their main genre
  });
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

  // Validate genres to ensure no overlap between fiction and non-fiction
  const genresQuery = `SELECT Name, Main_genre FROM Genre`;
  db.query(genresQuery, (err, results) => {
    if (err) {
      console.error("Error fetching genres:", err);
      return res.status(500).json({ message: "Database error while fetching genres." });
    }

    // Separate genres into Fiction and Non-Fiction
    const fictionGenres = results.filter((g) => g.Main_genre === "Fiction").map((g) => g.Name);
    const nonFictionGenres = results.filter((g) => g.Main_genre === "Non-Fiction").map((g) => g.Name);

    // Check if selected genres belong to both categories
    const hasFiction = Genres.some((genre) => fictionGenres.includes(genre));
    const hasNonFiction = Genres.some((genre) => nonFictionGenres.includes(genre));

    if (hasFiction && hasNonFiction) {
      return res.status(400).json({
        message: "A book cannot belong to both Fiction and Non-Fiction genres.",
      });
    }

    // If validation passes, proceed with book insertion
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
          await insertGenres();
          console.log("Genres added successfully!");
        } catch (err) {
          console.error("Error inserting genres:", err);
          res.status(500).json({ message: "Database error while inserting genres." });
        }
      });
    };

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

    // Check if the author exists and proceed
    const checkAuthorQuery = `SELECT ID FROM Author WHERE Fname = ? AND Lname = ?`;
    db.query(checkAuthorQuery, [normalizedFname, normalizedLname], (err, authorResults) => {
      if (err) {
        console.error("Error checking author:", err);
        return res.status(500).json({ message: "Database error while checking author." });
      }

      let authorId;

      const handlePublisher = () => {
        const insertPublisherQuery = `INSERT IGNORE INTO Publisher (Name, Email, Phone) VALUES (?, ?, ?)`;
        db.query(insertPublisherQuery, [normalizedPublisher, Email, Phone], (err) => {
          if (err) {
            console.error("Error inserting publisher:", err);
            return res.status(500).json({ message: "Database error while inserting publisher." });
          }
          insertBook(authorId);
        });
      };

      if (authorResults.length > 0) {
        authorId = authorResults[0].ID;
        handlePublisher();
      } else {
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
});

app.post("/BoookAdd", (req, res) => {
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
  const checkAuthorQuery = `SELECT ID FROM Author WHERE Fname = ? AND Lname = ?`;
  db.query(checkAuthorQuery, [normalizedFname, normalizedLname], (err, authorResults) => {
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
  const { username, password, genres } = req.body;

  // Handle Change Password
  if (password) {
    if (!username || !password) {
      return res.status(400).send("Invalid data. Ensure username and password are provided.");
    }
    


    const updatePasswordQuery = "UPDATE User SET Password = ? WHERE Username = ?";
    db.query(updatePasswordQuery, [password, username], (err, result) => {
      console.log("Username:", username);
      console.log("Password:", password);
      if (err) {
        console.error("Error updating password:", err.message);
        return res.status(500).send("Failed to update password.");
      }

      if (result.affectedRows === 0) {
        return res.status(404).send("User not found.");
      }

      console.log("Password updated successfully for username:", username);
      res.send("Password updated successfully!");
    });

    return; // Exit after handling "Change Password"
  }

  // Handle Select Genres
  if (genres) {
    if (!username || !Array.isArray(genres)) {
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

    return; // Exit after handling "Select Genres"
  }

  // If neither password nor genres are provided, return an error
  res.status(400).send("Invalid request. Provide either a password or genres.");
});

app.post("/", (req, res) => {
  console.log("hi");
  const { username, password } = req.body;

  console.log(username);
  console.log(password);

  // If no username or password is provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  // First, check if the user is an admin
  const adminQuery = "SELECT * FROM Admin WHERE Username = ?";
  db.query(adminQuery, [username], (err, adminResults) => {
    if (err) {
      console.error("Error checking for admin", err);
      return res.status(500).json({ message: "Database error." });
    }

    if (adminResults.length > 0) {
      const admin = adminResults[0];

      if (admin.Password === password) {
        return res.status(200).json({
          message: "Admin login successful",
          role: "admin",
          username: admin.Username,
        });
      } else {
        return res.status(400).json({ error: "Invalid username or password for admin." });
      }
    }

    // If not an admin, check for regular user
    const userQuery = "SELECT * FROM User WHERE Username = ?";
    db.query(userQuery, [username], (err, userResults) => {
      if (err) {
        console.error("Error checking for existing usernames", err);
        return res.status(500).json({ message: "Database error." });
      }

      if (userResults.length === 0) {
        // Username does not exist
        return res.status(400).json({ message: "Username does not exist, please make an account." });
      }

      const user = userResults[0];
      if (user.Password === password) {
        // Successful login for regular user
        return res.status(200).json({
          message: "Login successful",
          role: "user", // Role indicating regular user
          username: user.Username,
        });
      } else {
        // Incorrect password
        return res.status(400).json({ error: "Invalid username or password." });
      }
    });
  });
});

app.post("/meow", (req, res) => {
  console.log("hi");
  const { username, password } = req.body;
  
  //req.session.username = username; 
  console.log(username);
  console.log(password);


  // if no username or password, enter error message that says that user name and password arr required 
  if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
  }


  // first check if the user is an admin 
  // set the role to admin
  /*const adminQuery = "SELECT * FROM Admin WHERE Username = ?";
  db.query(adminQuery, [username], (err, adminResults) =>{
      if (err) {
          console.error("Error checking for admin", err);
          return res.status(500).json({ message: "Database error." });
      }

      if (adminResults>0){
          const admin = adminResults[0];

          if(admin.Username== username && admin.Password == password){
              return res.status(200).json({
                  message: "Admin login successful",
                  role: "admin", // role indicating admin
                  username: admin.Username
              });

          }

          else {
              return res.status(400).json({ error: "Invalid username or password." });
          }



      }


  }); */



  // select all usernames from database and see if it matches 

  // this will select all attributes of the Username 
  const query = "SELECT * FROM User WHERE Username = ?";
  db.query(query, [username], (err, results) => {
      if (err) {
          console.error("Error checking for existing usernames", err)
          return res.status(500).json({ message: "Database error." });
      }

  // if the username and password is not in the database then say invalid username and password
      
  if (results.length === 0) {
      // Username does not exist
      return res.status(400).json({ message: "Username does not exist, please make an account" });
    }

      const user = results[0];
      console.log(user);
      console.log(user.Username);
      console.log(user.Password);


      // if username is in the database grant access 
      if (user.Password == password && user.Username == username) {
          // Successful login message 

          return res.status(200).json({ message: "Login successful", username: user.Username }); 
          
      } 
      else {
          // Incorrect password
          return res.status(400).json({ error: "Invalid username or password." });
      }
  });
});

// Start the server
const PORT = 8800;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
