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

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "My_book_list",
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
/**
 * isbn - string
 * filter - string
 * username - string
 */
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
/**
 * username - string
 * isbn - string
 */
app.get("/users/:user/book/:isbn/recommendation", (req, res) => {
  const username = req.params.user;
  const isbn = req.params.isbn;
  getUsernameRecommendations(res, isbn, username);
});

//getInfoBook or get Book and author
/**
 * isbn - string
 * short - string
 */
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
//nothing
app.get("/books", (req, res) => {
  all(res);
});

// get all tags,
//nothing
app.get("/tag", (req, res) => {
  getTags(res, "Tag", ["Name"]);
});

//testing123
app.get("/", (req, res) => {
  res.json("hello world!");
});

//upvote/downvote
/**
 * username -- string
 * isbn -- string
 * reccisbn -- string
 * value -- number
 *
 */
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

/**
 * username -- string
 * isbn -- string
 * reccisbn -- string
 * value -- number
 *
 */
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
/**
 * username -- string
 * isbn -- string
 * reccisbn -- string
 * comment --string
 * tags -- list of strings
 */
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

/**
 * username -- string
 * isbn -- string
 * reccisbn -- string
 * comment --string
 * tags -- list of strings
 */
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

app.listen(8800, () => {
  console.log("Connected to the backend!");
});

/**
 * const missingFields = [];
if (!ISBN) missingFields.push("ISBN");
if (!Genres || Genres.length === 0) missingFields.push("At least one genre selection");

if (missingFields.length > 0) {
  return res.status(400).json({
    message: `The following required fields are missing: ${missingFields.join(", ")}`,
  });
}


  // Normalize inputs
  const normalizedPublisher = Publisher.trim();
 */
