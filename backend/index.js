import express from "express";
import mysql from "mysql";
import cors from "cors";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
require("dotenv").config({ path: "./.env" });
const { query, validationResult } = require("express-validator");

const app = express();
app.use(express.json());
app.use(cors()); // Allow Vite frontend

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "My_book_list",
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
      return res.status(400).json({
        message: "Username already exists. Please choose a different one.",
      });
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
  if (!Genres || Genres.length === 0)
    missingFields.push("At least one genre selection");

  if (missingFields.length > 0) {
    return res.status(400).json({
      message: `The following required fields are missing: ${missingFields.join(
        ", "
      )}`,
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
    db.query(
      insertBookQuery,
      [ISBN, Title, PurchaseLink, authorId, normalizedPublisher, Description],
      async (err) => {
        if (err) {
          console.error("Error inserting book:", err);
          return res
            .status(500)
            .json({ message: "Database error while inserting book." });
        }
        res.status(200).json({ message: "Book added successfully!" });

        if (SeriesName && BookOrder) {
          const insertSeriesQuery = `
          INSERT INTO Book_series (Book_isbn, Series_name, Book_order)
          VALUES (?, ?, ?)`;

          db.query(
            insertSeriesQuery,
            [ISBN, SeriesName, BookOrder],
            (seriesErr) => {
              if (seriesErr) {
                console.error("Error inserting into Book_series:", seriesErr);
                return res.status(500).json({
                  message: "Database error while inserting into Book_series.",
                });
              }
              console.log("Book series added successfully!");
            }
          );
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
              return res
                .status(500)
                .json({ message: "Database error while updating favorites." });
            }
            console.log("Favorite status updated successfully!");
          });
        }

        try {
          await insertGenres(); // Call the insertGenres function
          console.log("Genres added successfully!");
        } catch (err) {
          console.error("Error inserting genres:", err);
          res
            .status(500)
            .json({ message: "Database error while inserting genres." });
        }
      }
    );
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
  db.query(
    checkAuthorQuery,
    [normalizedFname, normalizedLname, DOB],
    (err, authorResults) => {
      if (err) {
        console.error("Error checking author:", err);
        return res
          .status(500)
          .json({ message: "Database error while checking author." });
      }

      let authorId;

      const handlePublisher = () => {
        // Use INSERT IGNORE to add the publisher only if it doesn't exist
        const insertPublisherQuery = `INSERT IGNORE INTO Publisher (Name, Email, Phone) VALUES (?, ?, ?)`;
        db.query(
          insertPublisherQuery,
          [normalizedPublisher, Email, Phone],
          (err) => {
            if (err) {
              console.error("Error inserting publisher:", err);
              return res
                .status(500)
                .json({ message: "Database error while inserting publisher." });
            }
            console.log("Publisher verified/added:", normalizedPublisher);
            insertBook(authorId);
          }
        );
      };

      if (authorResults.length > 0) {
        // Author exists
        authorId = authorResults[0].ID;
        handlePublisher();
      } else {
        // Insert new author
        const insertAuthorQuery = `INSERT INTO Author (Fname, Lname, DOB) VALUES (?, ?, ?)`;
        db.query(
          insertAuthorQuery,
          [normalizedFname, normalizedLname, DOB],
          (err, authorInsertResult) => {
            if (err) {
              console.error("Error inserting author:", err);
              return res
                .status(500)
                .json({ message: "Database error while inserting author." });
            }
            authorId = authorInsertResult.insertId;
            handlePublisher();
          }
        );
      }
    }
  );
});

app.post("/settings", (req, res) => {
  const { username, genres } = req.body;

  // Validate incoming data
  if (!username || !genres || !Array.isArray(genres)) {
    return res
      .status(400)
      .send("Invalid data. Ensure username and genres are provided.");
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
          return res
            .status(400)
            .send("One or more genres do not exist in the Genre table.");
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
      return res
        .status(500)
        .json({ message: "Database error while checking author." });
    }

    const handlePublisherAndBookInsertion = (authorId) => {
      // Step 2: Check if the publisher exists
      const checkPublisherQuery = `SELECT Name FROM Publisher WHERE Name = ?`;
      db.query(checkPublisherQuery, [Publisher], (err, publisherResults) => {
        if (err) {
          console.error("Error checking publisher:", err);
          return res
            .status(500)
            .json({ message: "Database error while checking publisher." });
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
                return res
                  .status(500)
                  .json({ message: "Database error while inserting book." });
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
              return res
                .status(500)
                .json({ message: "Database error while inserting publisher." });
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
      db.query(
        insertAuthorQuery,
        [Fname, Lname, DOB],
        (err, authorInsertResult) => {
          if (err) {
            console.error("Error inserting author:", err);
            return res
              .status(500)
              .json({ message: "Database error while inserting author." });
          }
          handlePublisherAndBookInsertion(authorInsertResult.insertId);
        }
      );
    }
  });
});

//testing123
function all(res) {
  const query = "SELECT * FROM Book";
  db.query(query, (err, data) => {
    if (err) {
      return res.status(500).send(err);
    } else {
      return res.status(200).json(data);
    }
  });
}

/**
 * tableName = string,
 * attributes = an array of strings
 */
function add(res, tableName, attributes) {
  const query = "INSERT INTO ?? VALUES (?)";
  return db.query(query, [tableName, attributes], (err, data) => {
    if (err) {
      return res
        .status(500)
        .send({ error: `Error inserting into ${tableName}`, details: err });
    } else {
      return res.status(201).send({ msg: "Operation was succseful!" });
    }
  });
}

/**
 * tableName = string
 * whereClause = list of objects. where the column name is the key and value is the column value
 */

function my_delete(res, tableName, whereClause) {
  const query =
    "DELETE FROM ?? WHERE " +
    whereClause
      .map((item) => {
        return mysql.escape(item);
      })
      .join(" AND ");

  return db.query(query, [tableName, whereClause], (err, data) => {
    if (err) {
      return res
        .status(500)
        .send({ error: `Error deleting from ${tableName}`, details: err });
    } else {
      return res.status(204).end();
    }
  });
}

/**
 * tableName = string,
 * attributes = array of strings,
 * whereClause = list of objects. where the column name is the key and value is the column value
 */
function get(res, tableName, attributes, whereClause) {
  let query =
    "SELECT ?? FROM ?? WHERE " +
    whereClause
      .map((item) => {
        return mysql.escape(item);
      })
      .join(" AND ");

  if (whereClause.length == 0) {
    query = "SELECT ?? FROM ??";
  }

  db.query(query, [attributes, tableName, whereClause], (err, data) => {
    if (err) {
      return res
        .status(500)
        .send({ error: `Error selecting from ${tableName}`, details: err });
    } else {
      return res.status(200).json(data);
    }
  });
}

/**
 * tableName = string,
 * attributes = array of strings,
 */
function getTags(res, tableName, attributes) {
  let query = "SELECT JSON_ARRAYAGG(??) AS Name FROM ?? ";

  db.query(query, [attributes, tableName], (err, data) => {
    if (err) {
      return res
        .status(500)
        .send({ error: `Error selecting from ${tableName}`, details: err });
    } else {
      data[0].Name = JSON.parse(data[0].Name);
      return res.status(200).json(data[0].Name);
    }
  });
}

/**
 * tableName = string
 * attributes = an object. For each key-val pair the column name is the key and  the column value is the new value
 * whereClause = list of objects. where the column name is the key and  the column value is the value
 */

function modify(res, tableName, attributes, whereClause) {
  const query =
    "UPDATE ?? SET ? WHERE " +
    whereClause
      .map((item) => {
        return mysql.escape(item);
      })
      .join(" AND ");

  db.query(query, [tableName, attributes], (err, data) => {
    if (err) {
      return res
        .status(500)
        .send({ error: `Error modifying ${tableName}`, details: err });
    } else {
      return res.status(204).end();
    }
  });
}

/*
 * tableName = string
 * attributes = name
 * value = value
 * whereClause = list of objects. where the column name is the key and  the column value is the value
 */

function modifyVote(res, tableName, attribute, value, whereClause) {
  const query =
    "UPDATE ?? SET ?? = ?? + ?  WHERE " +
    whereClause
      .map((item) => {
        return mysql.escape(item);
      })
      .join(" AND ");

  db.query(query, [tableName, attribute, attribute, value], (err, data) => {
    if (err) {
      return res
        .status(500)
        .send({ error: `Error modifying ${tableName}`, details: err });
    } else {
      return res.status(204).end();
    }
  });
}

/**
 * isbn - string
 */
function getInfoBook(res, isbn) {
  const query = `SELECT Book.ISBN, Title, Purchase_link, Publisher_name, Summary, Fname, Lname, Series_name, Username, Book_order,
  JSON_ARRAYAGG(Genre_name) AS Genre
  FROM ( ( (Book JOIN Author ON Book.Author_id = Author.ID ) LEFT OUTER JOIN Book_series ON
  Book_series.Book_isbn=Book.ISBN ) LEFT OUTER JOIN Favorites ON Favorites.Book_isbn=Book.ISBN)
  JOIN Posseses ON Posseses.Book_isbn=Book.ISBN
  WHERE Book.ISBN = ?
  GROUP BY Book.ISBN
      `;
  db.query(query, [isbn], (err, data) => {
    if (err) {
      return res
        .status(500)
        .send({ error: `Error selecting from Book`, details: err });
    } else {
      data[0].Genre = JSON.parse(data[0].Genre);
      return res.status(200).json(data);
    }
  });
}

/**
 * isbn - string
 */
function getBookAndAuthor(res, isbn) {
  const query = `SELECT Book.ISBN, Fname, Lname, Series_name, Book_order 
      FROM (Book JOIN Author ON Book.Author_id = Author.ID ) LEFT OUTER JOIN Book_series ON Book_series.Book_isbn=Book.ISBN 
      WHERE Book.ISBN= ?`;
  db.query(query, [isbn], (err, data) => {
    if (err) {
      return res
        .status(500)
        .send({ error: `Error selecting from Book`, details: err });
    } else {
      return res.status(200).json(data);
    }
  });
}

/**
 * isbn - string
 * username - string
 */
function getAllLikeInfoRecommendation(res, isbn, username) {
  const query = `SELECT Book_isbn, Recommended_isbn, Comment, Up_vote, Down_vote, Username, Title, Fname, Lname, 
  JSON_ARRAYAGG(Tag_name) AS Tag
  FROM ((Recommendation JOIN Book ON Book.ISBN=Recommended_isbn) JOIN  Author ON Author.ID=Book.Author_id) 
  NATURAL JOIN Recommendation_tag
  WHERE Book_isbn= ? AND Recommended_isbn IN 
  (SELECT PS.Book_isbn FROM Posseses AS PS NATURAL JOIN Likes AS LS WHERE Username= ?  )
  GROUP BY Book_isbn, Recommended_isbn,Username
      `;
  db.query(query, [isbn, username], (err, data) => {
    if (err) {
      return res
        .status(500)
        .send({ error: `Error selecting Reccomendations`, details: err });
    } else {
      data = data.map((entry) => {
        entry.Tag = JSON.parse(entry.Tag);
        return entry;
      });
      return res.status(200).json(data);
    }
  });
}

/**
 * isbn - string
 */
function getAllInfoRecommendation(res, isbn) {
  const query = `SELECT Book_isbn, Recommended_isbn, Comment, Up_vote, Down_vote, Username, Title, Fname, Lname, 
  JSON_ARRAYAGG(Tag_name) AS Tag
  FROM ((Recommendation JOIN Book ON Book.ISBN=Recommended_isbn) JOIN  Author ON Author.ID=Book.Author_id) 
  NATURAL JOIN Recommendation_tag
  WHERE Book_isbn= ?
  GROUP BY Book_isbn, Recommended_isbn,Username`;

  db.query(query, [isbn], (err, data) => {
    if (err) {
      return res
        .status(500)
        .send({ error: `Error selecting Reccomendations`, details: err });
    } else {
      data = data.map((entry) => {
        entry.Tag = JSON.parse(entry.Tag);
        return entry;
      });
      return res.status(200).json(data);
    }
  });
}

/**
 * values - array of strings
 */
function getUsernameRecommendations(res, isbn, username) {
  const query = `SELECT Book_isbn, Recommended_isbn, Comment, Up_vote, Down_vote, Username, Title, Fname, Lname, 
  (SELECT JSON_ARRAYAGG(T.Tag_name) 
      FROM Recommendation_tag AS T 
      WHERE T.Username= ?  AND T.Book_isbn= ? AND T.Recommended_isbn=Recommendation.Recommended_isbn) AS Selected,
   (SELECT JSON_ARRAYAGG(Name) 
      FROM Tag 
      WHERE Name NOT IN (SELECT T.Tag_name
      FROM Recommendation_tag AS T 
      WHERE T.Username= ? AND T.Book_isbn= ? AND T.Recommended_isbn=Recommendation.Recommended_isbn )) AS NotSelected
  FROM (Recommendation JOIN Book ON Book.ISBN=Recommended_isbn) JOIN  Author ON Author.ID=Book.Author_id
  WHERE Book_isbn= ? AND Username= ?`;

  db.query(
    query,
    [username, isbn, username, isbn, isbn, username],
    (err, data) => {
      if (err) {
        console.error("Error fetching data for User's Posts:", err);
        return res
          .status(500)
          .send({ error: "Database error for User's Posts" });
      } else {
        data = data.map((entry) => {
          entry.Selected = JSON.parse(entry.Selected);
          entry.NotSelected = JSON.parse(entry.NotSelected);
          return entry;
        });
        return res.status(200).json(data);
      }
    }
  );
}

function addRecommendation(res, reccValues, tags) {
  db.beginTransaction((err) => {
    if (err) {
      console.error("Error starting transaction:", err);
      return res
        .status(500)
        .send({ error: "Error starting transaction", details: err });
    }

    // First insert
    db.query(
      "INSERT INTO Recommendation (Username, Book_isbn, Recommended_isbn, `Comment`, Up_vote, Down_vote) VALUES (?)",
      [reccValues],
      (err, results) => {
        if (err) {
          return db.rollback(() => {
            console.error("Error inserting into Reccomendation:", err);
            let msg;
            if (err.code === "ER_DUP_ENTRY") {
              msg = "Data already exists in the database.";
            } else msg = "Error inserting into Recommendation";
            res.status(500).send({
              error: msg,
              details: err,
            });
          });
        }

        // Second insert
        db.query(
          "INSERT INTO Recommendation_tag (Tag_name, Username, Book_isbn, Recommended_isbn) VALUES ?",
          [tags],
          (err, results) => {
            if (err) {
              return db.rollback(() => {
                console.error("Error inserting into Recommendation_tag:", err);
                res.status(500).send({
                  error: "Error inserting into Recommendation_tag",
                  details: err,
                });
              });
            }

            // commit
            db.commit((err) => {
              if (err) {
                return db.rollback(() => {
                  console.error("Error committing transaction:", err);
                  res.status(500).send({
                    error: "Error committing transaction",
                    details: err,
                  });
                });
              }
              res
                .status(201)
                .send({ message: "Transaction completed successfully!" });
            });
          }
        );
      }
    );
  });
}

function updateRecommendation(res, value, primaryKey, tags, tagsOnly) {
  db.beginTransaction((err) => {
    if (err) {
      console.error("Error starting transaction:", err);
      return res
        .status(500)
        .send({ error: "Error starting transaction", details: err });
    }

    let query =
      "UPDATE Recommendation SET ? WHERE " +
      primaryKey
        .map((item) => {
          return mysql.escape(item);
        })
        .join(" AND ");

    // First
    db.query(query, [value], (err, results) => {
      if (err) {
        return db.rollback(() => {
          console.error("Error inserting into Reccomendation:", err);
          res.status(500).send({
            error: "Error inserting into Recommendation",
            details: err,
          });
        });
      }

      // Second
      db.query(
        "INSERT IGNORE INTO Recommendation_tag (Tag_name, Username, Book_isbn, Recommended_isbn) VALUES ?",
        [tags],
        (err, results) => {
          if (err) {
            return db.rollback(() => {
              console.error("Error inserting into Recommendation_tag:", err);
              res.status(500).send({
                error: "Error inserting into Recommendation_tag",
                details: err,
              });
            });
          }

          // Third
          db.query(
            "DELETE FROM Recommendation_tag WHERE Tag_name NOT IN (?) AND " +
              primaryKey
                .map((item) => {
                  return mysql.escape(item);
                })
                .join(" AND "),
            [tagsOnly],
            (err, results) => {
              if (err) {
                return db.rollback(() => {
                  console.error("Error deleting from Recommendation_tag:", err);
                  res.status(500).send({
                    error: "Error deleting from Recommendation_tag",
                    details: err,
                  });
                });
              }

              // commit
              db.commit((err) => {
                if (err) {
                  return db.rollback(() => {
                    console.error("Error committing transaction:", err);
                    res.status(500).send({
                      error: "Error committing transaction",
                      details: err,
                    });
                  });
                }
                res.status(204).end();
              });
            }
          );
        }
      );
    });
  });
}

//getAllInfoRecc and //getallinfoLikeRecc.
app.get("/book/:isbn/recommendation", (req, res) => {
  const isbn = req.params.isbn;
  const filter = req.query.filter;
  const username = req.query.username;
  if (filter == "true") {
    if (username == undefined)
      return res.status(400).send("Invalid request, username is missing.");
    else getAllLikeInfoRecommendation(res, isbn, username);
  } else {
    getAllInfoRecommendation(res, isbn);
  }
});

//getUserPostsForAbook for edit reccomendations
app.get("/users/:user/book/:isbn/recommendation", (req, res) => {
  const username = req.params.user;
  const isbn = req.params.isbn;
  getUsernameRecommendations(res, isbn, username);
});

//getInfoBook or get Book and author
app.get("/book/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const short_response = req.query.short;
  if (short_response == "true") {
    getBookAndAuthor(res, isbn);
  } else {
    getInfoBook(res, isbn);
  }
});

//testing123
app.get("/books", (req, res) => {
  all(res);
});

// get all tags,
app.get("/tag", (req, res) => {
  getTags(res, "Tag", ["Name"]);
});

//testing123
app.get("/", (req, res) => {
  res.json("hello world!");
});

//upvote/downvote
app.put(
  "/users/:user/book/:isbn/recommendation/:reccIsbn/upvote",
  (req, res) => {
    const user = { Username: req.params.user };
    const isbn = { Book_isbn: req.params.isbn };
    const reccIsbn = { Recommended_isbn: req.params.reccIsbn };
    const value = req.body.upvote;
    modifyVote(res, "Recommendation", "Up_vote", value, [user, isbn, reccIsbn]);
  }
);

app.put(
  "/users/:user/book/:isbn/recommendation/:reccIsbn/downvote",
  (req, res) => {
    const user = { Username: req.params.user };
    const isbn = { Book_isbn: req.params.isbn };
    const reccIsbn = { Recommended_isbn: req.params.reccIsbn };
    const downvote = req.body.downvote;
    modifyVote(res, "Recommendation", "Down_vote", downvote, [
      user,
      isbn,
      reccIsbn,
    ]);
  }
);

//editRecc - update user's post
app.put(
  "/users/:user/book/:isbn/recommendation/:reccIsbn",
  (req, res, next) => {
    const user = { Username: req.params.user };
    const isbn = { Book_isbn: req.params.isbn };
    const reccIsbn = { Recommended_isbn: req.params.reccIsbn };

    const comment = { Comment: req.body.comment };
    const tagsOnly = req.body.tags;
    const tags = req.body.tags.map((tag) => {
      return [tag, req.params.user, req.params.isbn, req.params.reccIsbn];
    });
    updateRecommendation(res, comment, [user, isbn, reccIsbn], tags, tagsOnly);
  }
);

//addRecommendation
app.post("/users/:user/book/:isbn/recommendation/:reccIsbn", (req, res) => {
  const reccValues = [
    req.params.user,
    req.params.isbn,
    req.params.reccIsbn,
    req.body.comment,
    0,
    0,
  ];
  const tags = req.body.tags.map((tag) => {
    return [tag, req.params.user, req.params.isbn, req.params.reccIsbn];
  });
  addRecommendation(res, reccValues, tags);
});

// Start the server
app.listen(8800, () => {
  console.log(`Server running on http://localhost:8800\n`);
});
