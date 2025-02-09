import express from "express";
import mysql from "mysql";
import cors from "cors";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
require("dotenv").config({ path: "./.env" });
const {
  check,
  param,
  query,
  body,
  validationResult,
} = require("express-validator");

const app = express();
app.use(express.json());
app.use(cors()); // Allow Vite frontend

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "My_book_list",
});

//At times, the sequence diagrams functions are translated into routes in our implementation, since all a route does is execute the database function associated with that route.
//To make finding a function easier we have labelled routes/sections of codes
//with their corresponding function names in the sequence diagram.

//FUNCTION START: getUsereGenres
app.get(
  "/user-genres/:username",
  [
    param("username")
      .isString()
      .trim()
      .escape()
      .withMessage("Invalid username"),
    handleValidationErrors,
  ],
  (req, res) => {
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
  }
);
//FUNCTION End: getUserGenres

//FUNCTION Start: getGenres
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
//FUNCTION End: getGenres

//FUNCTION START: getMainGenres
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
//FUNCTION END: getMainGenres

//FUNCTION START: signup
app.post(
  "/UpSign",
  [
    body("username").isString().trim().escape().withMessage("Invalid username"),
    body("password")
      .isString()
      .trim()
      .escape()
      .withMessage("Password invalid."),
    handleValidationErrors,
  ],
  (req, res) => {
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
        res.status(200).json({ message: "New user added successfully!" });
      });
    });
  }
);
//FUNCTION END: signup

//FUNCTION START: addBook
app.post(
  "/BookAdd",
  [
    body("ISBN").trim().isISBN().withMessage("Invalid ISBN format"),
    body("Title").isString().trim().escape().withMessage("Title is required"),
    body("SeriesName")
      .optional()
      .isString()
      .trim()
      .escape()
      .withMessage("Series name must be a string"),
    body("BookOrder")
      .optional()
      .isString()
      .trim()
      .escape()
      .withMessage("Book order must be a string"),
    body("Fname")
      .isString()
      .trim()
      .escape()
      .withMessage("First name is required"),
    body("Lname")
      .isString()
      .trim()
      .escape()
      .withMessage("Last name is required"),
    body("DOB")
      .optional()
      .isISO8601()
      .withMessage("Invalid date of birth format. Use YYYY-MM-DD"),
    body("Publisher")
      .isString()
      .trim()
      .escape()
      .withMessage("Publisher is required"),
    body("Phone")
      .optional()
      .isMobilePhone()
      .withMessage("Invalid phone number"),
    body("Email").optional().isEmail().withMessage("Invalid email address"),
    body("Description")
      .optional()
      .isString()
      .trim()
      .escape()
      .withMessage("Invalid description format"),
    body("PurchaseLink")
      .optional()
      .isURL()
      .withMessage("Invalid purchase link URL."),
    body("isFavourite")
      .optional()
      .isBoolean()
      .withMessage("isFavourite must be a boolean"),
    body("adminUsername")
      .isString()
      .trim()
      .notEmpty()
      .withMessage("Admin username is required"),
    body("Genres")
      .isArray({ min: 1 })
      .withMessage("Genres must be a non-empty array"),
    body("Genres.*")
      .isString()
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Each genre must be a non-empty string"),
    handleValidationErrors,
  ],
  (req, res) => {
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

    if (Phone && (Phone.length !== 10 || !/^\d+$/.test(Phone))) {
      return res.status(400).json({
        message:
          "Invalid phone number. It must be 10 digits long and contain only numbers.",
      });
    }

    if (Email && (!Email.includes("@") || !Email.includes("."))) {
      return res.status(400).json({
        message: "Invalid email address. It must contain both '@' and '.'",
      });
    }
    if (PurchaseLink) {
      try {
        new URL(PurchaseLink);
        if (
          !PurchaseLink.startsWith("http://") &&
          !PurchaseLink.startsWith("https://")
        ) {
          return res.status(400).json({
            message:
              "Invalid purchase link. URL must start with http:// or https://.",
          });
        }
      } catch (e) {
        return res.status(400).json({
          message: "Invalid purchase link. Please provide a valid URL.",
        });
      }
    }

    // Validate genres to ensure no overlap between fiction and non-fiction
    const genresQuery = `SELECT Name, Main_genre FROM Genre`;
    db.query(genresQuery, (err, results) => {
      if (err) {
        console.error("Error fetching genres:", err);
        return res
          .status(500)
          .json({ message: "Database error while fetching genres." });
      }

      // Separate genres into Fiction and Non-Fiction
      const fictionGenres = results
        .filter((g) => g.Main_genre === "Fiction")
        .map((g) => g.Name);
      const nonFictionGenres = results
        .filter((g) => g.Main_genre === "Non-Fiction")
        .map((g) => g.Name);

      // Check if selected genres belong to both categories
      const hasFiction = Genres.some((genre) => fictionGenres.includes(genre));
      const hasNonFiction = Genres.some((genre) =>
        nonFictionGenres.includes(genre)
      );

      if (hasFiction && hasNonFiction) {
        return res.status(400).json({
          message:
            "A book cannot belong to both Fiction and Non-Fiction genres.",
        });
      }

      // If validation passes, proceed with book insertion
      const insertBook = (authorId) => {
        const insertBookQuery = `
        INSERT INTO Book (ISBN, Title, Purchase_link, Author_id, Publisher_name, Summary)
        VALUES (?, ?, ?, ?, ?, ?)`;
        db.query(
          insertBookQuery,
          [
            ISBN,
            Title,
            PurchaseLink,
            authorId,
            normalizedPublisher,
            Description,
          ],
          async (err) => {
            if (err) {
              console.error("Error inserting book:", err);
              return res
                .status(500)
                .json({ message: "Database error while inserting book." });
            }
            res.status(200).json({ message: "Book added successfully!" });

            //check if a series name or book has been added
            if (SeriesName && BookOrder) {
              const insertSeriesQuery = `
            INSERT INTO Book_series (Book_isbn, Series_name, Book_order)
            VALUES (?, ?, ?)`;

              db.query(
                insertSeriesQuery,
                [ISBN, SeriesName, BookOrder],
                (seriesErr) => {
                  if (seriesErr) {
                    console.error(
                      "Error inserting into Book_series:",
                      seriesErr
                    );
                    return res.status(500).json({
                      message:
                        "Database error while inserting into Book_series.",
                    });
                  }
                  console.log("Book series added successfully!");
                }
              );
            }

            //check if book had been favorited
            if (isFavourite) {
              const insertFavoriteQuery = `
            INSERT INTO Favorites (Username, Book_isbn)
            VALUES (?, ?)
            ON DUPLICATE KEY UPDATE Book_isbn = VALUES(Book_isbn);
          `;
              db.query(insertFavoriteQuery, [adminUsername, ISBN], (favErr) => {
                if (favErr) {
                  console.error("Error inserting into Favorites:", favErr);
                  return res.status(500).json({
                    message: "Database error while updating favorites.",
                  });
                }
                console.log("Favorite status updated successfully!");
              });
            }

            try {
              await insertGenres();
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
      db.query(
        checkAuthorQuery,
        [normalizedFname, normalizedLname],
        (err, authorResults) => {
          if (err) {
            console.error("Error checking author:", err);
            return res
              .status(500)
              .json({ message: "Database error while checking author." });
          }

          let authorId;

          const handlePublisher = () => {
            const insertPublisherQuery = `INSERT IGNORE INTO Publisher (Name, Email, Phone) VALUES (?, ?, ?)`;
            db.query(
              insertPublisherQuery,
              [normalizedPublisher, Email, Phone],
              (err) => {
                if (err) {
                  console.error("Error inserting publisher:", err);
                  return res.status(500).json({
                    message: "Database error while inserting publisher.",
                  });
                }
                insertBook(authorId);
              }
            );
          };

          if (authorResults.length > 0) {
            authorId = authorResults[0].ID;
            handlePublisher();
          } else {
            const insertAuthorQuery = `INSERT INTO Author (Fname, Lname, DOB) VALUES (?, ?, ?)`;
            db.query(
              insertAuthorQuery,
              [normalizedFname, normalizedLname, DOB],
              (err, authorInsertResult) => {
                if (err) {
                  console.error("Error inserting author:", err);
                  return res.status(500).json({
                    message: "Database error while inserting author.",
                  });
                }
                authorId = authorInsertResult.insertId;
                handlePublisher();
              }
            );
          }
        }
      );
    });
  }
);

//FUNCTION END: addBook

app.post(
  "/settings",
  [
    body("username").isString().trim().escape().withMessage("Invalid username"),
    body("password")
      .optional()
      .isString()
      .trim()
      .escape()
      .withMessage("Invalid password"),
    body("genres").optional().isArray().withMessage("Genres must be an array"),
    handleValidationErrors,
  ],
  (req, res) => {
    const { username, password, genres } = req.body;

    // Handle Change Password
    if (password) {
      if (!username || !password) {
        return res
          .status(400)
          .send("Invalid data. Ensure username and password are provided.");
      }

      //FUNCTION START: UpdatePasswordUser
      const updatePasswordQuery =
        "UPDATE User SET Password = ? WHERE Username = ?";
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
      //FUNCTION END: UpdatePasswordUser

      return; // Exit after handling "Change Password"
    }

    //FUNCTION START: UpdateGenres
    // Handle Select Genres
    if (genres) {
      if (!username || !Array.isArray(genres)) {
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

      return; // Exit after handling "Select Genres"
    }
    //FUNCTION END: UpdateGenres
    // If neither password nor genres are provided, return an error
    res
      .status(400)
      .send("Invalid request. Provide either a password or genres.");
  }
);

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
 * attributes = array of strings,
 */
function getTags(res) {
  let query = "SELECT JSON_ARRAYAGG(`Name`) AS Name FROM Tag ";

  db.query(query, (err, data) => {
    if (err) {
      return res
        .status(500)
        .send({ error: `Error selecting from Tag`, details: err });
    } else {
      data[0].Name = JSON.parse(data[0].Name);
      return res.status(200).json(data[0].Name);
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

function getBookBySearch(res, search) {
  const query = `SELECT Book.ISBN, Book.Title, CONCAT(Fname, " ", Lname) AS AuthorName, Series_name, Book_order 
    FROM (Book JOIN Author ON Book.Author_id = Author.ID ) LEFT OUTER JOIN Book_series ON Book_series.Book_isbn=Book.ISBN 
    WHERE Book.Title LIKE ? OR Author.Fname LIKE ? OR Author.Lname LIKE ? `;
  db.query(query, [search, search, search], (err, data) => {
    if (err) {
      return res
        .status(500)
        .send({ error: `Error selecting from Book`, details: err });
    } else {
      return res.status(200).json(data);
    }
  });
}

function getAllBookAndAuthor(res) {
  const query = `SELECT Book.ISBN, Book.Title, CONCAT(Fname, " ", Lname) AS AuthorName, Series_name, Book_order 
    FROM (Book JOIN Author ON Book.Author_id = Author.ID ) LEFT OUTER JOIN Book_series ON Book_series.Book_isbn=Book.ISBN`;
  db.query(query, (err, data) => {
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

//getUserPostsForAbook
app.get(
  "/users/:user/books/:isbn/recommendations",
  [
    param("user").isString().trim().escape().withMessage("Invalid username"),
    param("isbn").trim().isISBN().withMessage("Invalid ISBN format"),
    handleValidationErrors,
  ],
  (req, res) => {
    const username = req.params.user;
    const isbn = req.params.isbn;
    getUsernameRecommendations(res, isbn, username);
  }
);

// get all books filtered by keyword
app.get(
  "/books/filtered",
  [
    query("search")
      .isString()
      .trim()
      .escape()
      .withMessage("Search must be a string"),
    handleValidationErrors,
  ],
  (req, res) => {
    const search = req.query.search;
    getBookBySearch(res, "%" + search + "%");
  }
);

//getallinfoLikeRecc.
app.get(
  "/books/:isbn/recommendations/filtered",
  [
    param("isbn").trim().isISBN().withMessage("Invalid ISBN format"),
    query("username")
      .isString()
      .trim()
      .escape()
      .withMessage("Invalid username"),
    handleValidationErrors,
  ],
  (req, res) => {
    const isbn = req.params.isbn;
    const username = req.query.username;

    getAllLikeInfoRecommendation(res, isbn, username);
  }
);

//getAllInfoRecc and
app.get(
  "/books/:isbn/recommendations",
  [
    param("isbn").trim().isISBN().withMessage("Invalid ISBN format"),
    handleValidationErrors,
  ],
  (req, res) => {
    const isbn = req.params.isbn;
    getAllInfoRecommendation(res, isbn);
  }
);

//getInfoBook
app.get(
  "/books/:isbn",
  [
    param("isbn").trim().isISBN().withMessage("Invalid ISBN format"),
    handleValidationErrors,
  ],
  (req, res) => {
    const isbn = req.params.isbn;
    getInfoBook(res, isbn);
  }
);

//get all book
app.get("/books", (req, res) => {
  getAllBookAndAuthor(res);
});

//testing123
/*
app.get("/books", (req, res) => {
  all(res);
});*/

// get all tags,
app.get("/tags", (req, res) => {
  getTags(res);
});

//testing123
app.get("/", (req, res) => {
  res.json("hello world!");
});

//upvotes and downvotes
app.put(
  "/users/:user/books/:isbn/recommendations/:reccIsbn/votes",
  [
    param("user").isString().trim().escape().withMessage("Invalid username"),
    param("isbn").trim().isISBN().withMessage("Invalid ISBN format"),
    param("reccIsbn").trim().isISBN().withMessage("Invalid ISBN format"),
    body("vote").isString().withMessage("Vote must be a string"),
    body("value").isInt().withMessage("Value must be an intenger"),
    handleValidationErrors,
  ],
  (req, res) => {
    const user = { Username: req.params.user };
    const isbn = { Book_isbn: req.params.isbn };
    const reccIsbn = { Recommended_isbn: req.params.reccIsbn };
    const vote = req.body.vote;
    const value = req.body.value;
    modifyVote(res, "Recommendation", vote, value, [user, isbn, reccIsbn]);
  }
);

//editRecc - update user's post
app.put(
  "/users/:user/books/:isbn/recommendations/:reccIsbn",
  [
    param("user").isString().trim().escape().withMessage("Invalid username"),
    param("isbn").trim().isISBN().withMessage("Invalid ISBN format"),
    param("reccIsbn").trim().isISBN().withMessage("Invalid recommended ISBN"),
    body("comment").isString().trim().escape().withMessage("Invalid comment"),
    body("tags").isArray().withMessage("Tags must be an array of strings"),
    body("tags.*")
      .isString()
      .trim()
      .escape()
      .withMessage("Each tag must be a string"),
    handleValidationErrors,
  ],
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
app.post(
  "/users/:user/books/:isbn/recommendations/:reccIsbn",
  [
    param("user").isString().trim().escape().withMessage("Invalid username"),
    param("isbn").trim().isISBN().withMessage("Invalid ISBN format"),
    param("reccIsbn").trim().isISBN().withMessage("Invalid recommended ISBN"),
    body("comment").isString().trim().escape().withMessage("Invalid comment"),
    body("tags").isArray().withMessage("Tags must be an array of strings"),
    body("tags.*")
      .isString()
      .trim()
      .escape()
      .withMessage("Each tag must be a string"),
    handleValidationErrors,
  ],
  (req, res) => {
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
  }
);

//FUNCTION START: updatePasswordAdmin
app.post(
  "/adminSettings",
  [
    body("username")
      .isString()
      .trim()
      .notEmpty()
      .withMessage("Invalid username"),
    body("password").isString().trim().withMessage("Invalid password"),
    handleValidationErrors,
  ],
  (req, res) => {
    const { username, password } = req.body;

    // Handle Change Password
    if (password) {
      if (!username || !password) {
        return res
          .status(400)
          .send("Invalid data. Ensure username and password are provided.");
      }

      const updatePasswordQuery =
        "UPDATE Admin SET Password = ? WHERE Username = ?";
      db.query(updatePasswordQuery, [password, username], (err, result) => {
        console.log("Username:", username);
        console.log("Password:", password);
        if (err) {
          console.error("Error updating password:", err.message);
          return res.status(500).send("Failed to update password.");
        }

        if (result.affectedRows === 0) {
          return res.status(404).send("admin not found.");
        }

        console.log("Password updated successfully for username:", username);
        res.send("Password updated successfully!");
      });

      return; // Exit after handling "Change Password"
    }
  }
);
//FUNCTION END: updatePasswordAdmin

app.post(
  "/login",
  [
    body("username").isString().trim().withMessage("Username is required"),
    body("password").isString().trim().withMessage("Password is required"),
    handleValidationErrors,
  ],
  (req, res) => {
    console.log("hi");
    const { username, password } = req.body;

    console.log(username);
    console.log(password);

    // If no username or password is provided
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required." });
    }

    //FUNCTION START: adminLogin
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
            isAdmin: true,
            username: admin.Username,
          });
        } else {
          return res
            .status(400)
            .json({ error: "Invalid username or password for admin." });
        }
      }
      //FUNCTION END: adminLogin

      // If not an admin, check for regular user

      //FUNCTION START: userLogin
      const userQuery = "SELECT * FROM User WHERE Username = ?";
      db.query(userQuery, [username], (err, userResults) => {
        if (err) {
          console.error("Error checking for existing usernames", err);
          return res.status(500).json({ message: "Database error." });
        }

        if (userResults.length === 0) {
          // Username does not exist
          return res.status(400).json({
            message: "Username does not exist, please make an account.",
          });
        }

        const user = userResults[0];
        if (user.Password === password) {
          // Successful login for regular user
          return res.status(200).json({
            message: "Login successful",
            isAdmin: false, // Role indicating regular user
            username: user.Username,
          });
        } else {
          // Incorrect password
          return res
            .status(400)
            .json({ error: "Invalid username or password." });
        }
      });
      //FUNCTION END: userLogin
    });
  }
);

// create a function to get the author name from its id
function getAuthorById(req, res) {
  const { authorId } = req.params; // Get the authorId from the request parameters

  const query = "SELECT Fname, Lname FROM Author WHERE ID = ?";

  db.query(query, [authorId], (err, data) => {
    if (err) {
      return res.json({ error: "Error fetching author details", details: err });
    }
    if (data.length > 0) {
      return res.json(data[0]); // Return the first and last name
    } else {
      return res.status(404).json({ message: "Author not found" });
    }
  });
}

//FUNCTION START: getBookByBrowse
app.get(
  "/search/browse",
  [
    query("q").isString().trim().withMessage("Search term is required"),
    handleValidationErrors,
  ],
  (req, res) => {
    const searchTerm = req.query.q; // The word the user typed in
    const searchPattern = `%${searchTerm}%`; // For partial matches

    const searchQuery = `
    SELECT 
      Book.ISBN, 
      Book.Title, 
      CONCAT(Author.Fname, ' ', Author.Lname) AS AuthorName 
    FROM 
      Book
    LEFT JOIN 
      Author 
    ON 
      Book.Author_id = Author.ID
    WHERE 
      Book.Title LIKE ? OR CONCAT(Author.Fname, ' ', Author.Lname) LIKE ?
  `;

    db.query(searchQuery, [searchPattern, searchPattern], (err, results) => {
      if (err) {
        console.error("Error executing search query:", err.message);
        return res.status(500).send("Failed to fetch search results.");
      }

      res.json(results); // Send the results back to the frontend
    });
  }
);
//FUNCTION END: getBookByBrowse

app.get(
  "/author/:authorId",
  [
    param("authorId").isInt().withMessage("Author ID must be an integer"),
    handleValidationErrors,
  ],
  getAuthorById
);

// Start the server
app.listen(8800, () => {
  console.log(process.env.DB_HOST);
  console.log(`Server running on http://localhost:8800\n`);
});
