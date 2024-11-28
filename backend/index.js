import express from "express"
import mysql from "mysql"
import cors from "cors"

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "My_book_list",
});


function all(req,res){
    const query = "SELECT * FROM Book";
    db.query(query, (err, data)=>{
        if (err) {
            return  res.status(500).send(err)
        }else {
            return res.status(201).json(data)
        }
    })
}

//res.send and ?? and 2d array for add, are only changes that will effect merge!

/**
 * tableName = string,
 * attributes = 2D array of strings, where each sub-array is a row to insert into the table
*/ 
function add(req,res, tableName, attributes){
    const query = "INSERT INTO ?? VALUES ?";
    return db.query(query, [tableName, attributes], (err, data)=>{
        if (err) {
            return  res.status(500).send({ error: `Error inserting into ${tableName}`, details: err });
        }else {
            return res.status(201).json(data);
        }
    })
}


/**
 * tableName = string
 * whereClause = list of objects. where the column name is the key and value is the column value 
 */

function my_delete( req,res, tableName, whereClause){
    const query = "DELETE FROM ?? WHERE ?";
    return db.query(query, [tableName, whereClause], (err, data)=>{
        if (err) {
            return  res.status(500).send({ error: `Error deleting from ${tableName}`, details: err });
        }else {
            return res.status(204).json(data);
        }
    })

}

/**
 * tableName = string,
 * attributes = array of strings,
 * whereClause = list of objects. where the column name is the key and value is the column value 
 */
function get(req,res, tableName, attributes, whereClause){
    const query = "SELECT ?? FROM ?? WHERE ?"; 
    if (whereClause == []){
        query = "SELECT ?? FROM ??"; 
    }
   
    db.query(query, [attributes, tableName, whereClause], (err, data)=>{
        if (err) {
            return  res.status(500).send({ error: `Error selecting from ${tableName}`, details: err });
        }else {
            return res.status(200).json(data);
        }
    })

}

/**
 * tableName = string
 * attributes = list of objects. where the column name is the key and  the column value is the value 
 * whereClause = list of objects. where the column name is the key and  the column value is the value
 */

function modify(req,res, tableName, attributes, whereClause){
    const query = "UPDATE ?? SET ?  WHERE ?";
    db.query(query, [ tableName, attributes, whereClause], (err, data)=>{
        if (err) {
            return  res.status(500).send({ error: `Error modifying ${tableName}`, details: err });
        }else {
            return res.status(204).json(data);
        }
    })

}


/**
 * isbn - string
 */
function getInfoBook(req,res, isbn){
    const query = `SELECT Book.ISBN, Title, Purchase_link, Publisher_name, Summary, Fname, Lname, Series_name, Username, Book_order,
JSON_ARRAYAGG(Genre_name) AS \`Genre\`
FROM ( ( (Book JOIN Author ON Book.Author_id = Author.ID ) LEFT OUTER JOIN Book_series ON
Book_series.Book_isbn=Book.ISBN ) LEFT OUTER JOIN Favorites ON Favorites.Book_isbn=Book.ISBN)
JOIN Posseses ON Posseses.Book_isbn=Book.ISBN
WHERE Book.ISBN = ?
GROUP BY Book.ISBN
    `;
    db.query(query, [isbn], (err, data)=>{
        if (err) {
            return  res.status(500).send({ error: `Error selecting from Book`, details: err });
        }else {
            return res.status(200).json(data);
        }
    })

}

/**
 * isbn - string
 */
function getBookAndAuthor(req,res, isbn){
    const query = `SELECT Book.ISBN, Fname, Lname, Series_name, Book_order
FROM (Book JOIN Author ON Book.Author_id = Author.ID ) LEFT OUTER JOIN Book_series ON
Book_series.Book_isbn=Book.ISBN )
WHERE Book.ISBN= ?
    `;
    db.query(query, [isbn], (err, data)=>{
        if (err) {
            return  res.status(500).send({ error: `Error selecting from Book`, details: err });
        }else {
            return res.status(200).json(data);
        }
    })

}

/**
 * isbn - string
 * username - string
 */
function getAllLikeInfoRecommendation(req,res, isbn, username){
    const query = `SELECT Book_isbn, Recommended_isbn, \`Comment\`, Up_vote, Down_vote, Username, Title, Fname, Lname, 
JSON_ARRAYAGG(Tag_name) AS \`Tag\`
FROM ((Recommendation JOIN Book ON Book.ISBN=Recommended_isbn) JOIN  Author ON Author.ID=Book.Author_id) 
NATURAL JOIN Recommendation_tag
WHERE Book_isbn= ? AND Recommended_isbn IN 
(SELECT PS.Book_isbn FROM Posseses AS PS NATURAL JOIN Likes AS LS WHERE Username= ?  )
GROUP BY Book_isbn, Recommended_isbn,Username
    `;
    db.query(query, [isbn, username], (err, data)=>{
        if (err) {
            return  res.status(500).send({ error: `Error selecting Reccomendations`, details: err });
        }else {
            return res.status(200).json(data);
        }
    })

} 


/**
 * isbn - string
 */
function getAllInfoRecommendation(req,res, isbn){
    const query = `SELECT Book_isbn, Recommended_isbn, \`Comment\`, Up_vote, Down_vote, Username, Title, Fname, Lname, 
JSON_ARRAYAGG(Tag_name) AS \`Tag\`
FROM ((Recommendation JOIN Book ON Book.ISBN=Recommended_isbn) JOIN  Author ON Author.ID=Book.Author_id) 
NATURAL JOIN Recommendation_tag
WHERE Book_isbn= ?
GROUP BY Book_isbn, Recommended_isbn,Username`;

    db.query(query, [isbn], (err, data)=>{
        if (err) {
            return  res.status(500).send({ error: `Error selecting Reccomendations`, details: err });
        }else {
            return res.status(200).json(data);
        }
    })

} 

//NEED TO ADD TO DIAGRAMS
/**
 * values - array of strings 
 */

//get selected and unselected
function getUsernameRecommendations(req,res, primaryKey){
    db.query(query, values , (err, result1)=>{
        if (err) {
            console.error('Error fetching data for User\'s Posts:', err);
            return res.status(500).send({ error: 'Database error for User\'s Posts' });
        }

        db.query(query,values, (err, result2) =>{
            if (err) {
                console.error('Error fetching data for User\'s Posts:', err);
                return res.status(500).send({ error: 'Database error for User\'s Posts' });
            }

            return res.status(200).json({ Post: result1, Tags : result2});

        })

    })
}


function addRecommendation(req,res, reccValues, tags){
    db.beginTransaction((err) => {
        if (err) {
          console.error('Error starting transaction:', err);
          return res.status(500).send({ error: 'Error starting transaction', details: err });
        }
    
        // First insert
        db.query(
          'INSERT INTO Recommendation (Username, Book_isbn, Recommended_isbn, `Comment`, Up_vote, Down_vote) VALUES ?',
          [reccValues],
          (err, results) => {
            if (err) {
              return db.rollback(() => {
                console.error('Error inserting into Reccomendation:', err);
                res.status(500).send({ error: 'Error inserting into Recommendation', details: err });
              });
            }
    
            // Second insert
            db.query(
              'INSERT INTO Recommendation_tag (Tag_name, Username, Book_isbn, Recommended_isbn) VALUES ?',
              [tags],
              (err, results) => {
                if (err) {
                  return db.rollback(() => {
                    console.error('Error inserting into Recommendation_tag:', err);
                    res.status(500).send({ error: 'Error inserting into Recommendation_tag', details: err });
                  });
                }
    
                // commit 
                    db.commit((err) => {
                        if (err) {
                        return db.rollback(() => {
                            console.error('Error committing transaction:', err);
                            res.status(500).send({ error: 'Error committing transaction', details: err });
                        });
                        }
    
                        console.log('Transaction completed successfully!');
                        res.status(200).send({ message: 'Transaction completed successfully!' });
                    });
              }
            );
          }
        );
      });
}


function editRecommendation(req,res, values, primaryKey,  tags, tagsOnly){
    db.beginTransaction((err) => {
        if (err) {
          console.error('Error starting transaction:', err);
          return res.status(500).send({ error: 'Error starting transaction', details: err });
        }
    
        // First 
        db.query(
          'UPDATE Recommendation SET ? WHERE ?',
          [values, primaryKey],
          (err, results) => {
            if (err) {
              return db.rollback(() => {
                console.error('Error inserting into Reccomendation:', err);
                res.status(500).send({ error: 'Error inserting into Recommendation', details: err });
              });
            }
    
            // Second 
            db.query(
              'INSERT IGNORE INTO Recommendation_tag (Tag_name, Username, Book_isbn, Recommended_isbn) VALUES ?',
              [tags],
              (err, results) => {
                if (err) {
                  return db.rollback(() => {
                    console.error('Error inserting into Recommendation_tag:', err);
                    res.status(500).send({ error: 'Error inserting into Recommendation_tag', details: err });
                  });
                }


                 // Third 
                db.query(
                    'DELETE FROM Recommendation_tag WHERE ? AND (Tag_name) NOT IN (?)',
                    [primaryKey, tagsOnly],
                    (err, results) => {
                    if (err) {
                        return db.rollback(() => {
                        console.error('Error deleting from Recommendation_tag:', err);
                        res.status(500).send({ error: 'Error deleting from Recommendation_tag', details: err });
                        });
                    }
        
                    // commit 
                        db.commit((err) => {
                            if (err) {
                            return db.rollback(() => {
                                console.error('Error committing transaction:', err);
                                res.status(500).send({ error: 'Error committing transaction', details: err });
                            });
                            }
        
                            console.log('Transaction completed successfully!');
                            res.status(200).send({ message: 'Transaction completed successfully!' });
                        });
                    }
                );
              }
            );
          }
        );
      });
}

// get all tags,
app.get("/tag", (req,res)=>{
    get(req,res,"Tag", ["`Name`"], []);

});

//getInfoBook and genres of a book 
app.get("/book/:isbn", (req,res) => {
    const isbn = req.params.isbn;
    getInfoBook(req,res,isbn);
}); 

//addRecommendation
app.post("users/:user/book/:isbn/recommendation/:reccIsbn", (req, res)=>{
    const reccValues = [req.body.username,req.body.bookIsbn, req.body.reccIsbn, req.body.comment];
    const tags = req.body.tags.map((tag)=>{ return [tag, req.body.username,req.body.bookIsbn, req.body.reccIsbn]} );
 
    addRecommendation(req,res, [reccValues], tags);
});


//getAllInfoRecc and //getallinfoLikeRecc.
app.get("/book/:isbn/recommendation", (req,res) => {
    const isbn = req.params.isbn;
    const username = req.query.username;
    if ( req.query.genres){
        getAllLikeInfoRecommendation(req,res,isbn, username);
    }
    else{
        getAllInfoRecommendation(req,res,isbn);
    }
});

//getUserPostsForAbook 
app.get("users/:user/book/:isbn/recommendation", (req,res)=>{
    const user = req.params.user; 
    const isbn = req.params.isbn; 
    getUsernameRecommendations(req,res,"Recommendation",[user,isbn], whereClause);
});

//upvote/downvote 
app.put("users/:user/book/:isbn/recommendation/:reccIsbn/upvote", (req,res)=>{
    const user = {Username : req.params.user}; 
    const isbn = {Book_isbn : req.params.isbn}; 
    const reccIsbn = {Recommended_isbn : req.params.reccIsbn};; 
    const upvote =  {Up_vote : `Up_vote + ${req.body.upvote}` };
    modify(req,res,"Recommendation", [upvote], [user, isbn, reccIsbn]);
});

app.put("users/:user/book/:isbn/recommendation/:reccIsbn/downvote", (req,res)=>{
    const user = {Username : req.params.user}; 
    const isbn = {Book_isbn : req.params.isbn}; 
    const reccIsbn = {Recommended_isbn : req.params.reccIsbn};; 
    const downvote =  {Down_vote : `Down_vote + ${req.body.downvote}` };
    modify(req,res,"Recommendation", [downvote], [user, isbn, reccIsbn]);
    
})

//editRecc
app.put("users/:user/book/:isbn/recommendation/:reccIsbn", (req,res, next)=>{
    const user = {Username : req.params.user}; 
    const isbn = {Book_isbn : req.params.isbn}; 
    const reccIsbn = {Recommended_isbn : req.params.reccIsbn};; 

    const comment = {Comment : req.body.comment};
    const tagsOnly = req.body.tags;
    const tags = req.body.tags.map((tag)=>{ return [tag, req.body.username,req.body.bookIsbn, req.body.reccIsbn]} );
    editRecommendation([comment], [user, isbn, reccIsbn], tags, tagsOnly);
})

app.get("/", (req,res)=>{
    res.json("hello this is the backend");
});

app.get("/books", (req,res) => {
    all(req,res);
});

app.listen(8800, ()=> {
    console.log("Connected to the backend!");
});


/*
app.get('/users/:user/books', (req, res) => {
  const user = req.params.user;
  const bookIds = req.query.ids ? req.query.ids.split(',') : [];
  res.send(`User: ${user}, Book IDs: ${bookIds.join(', ')}`);

  /users/john/books?ids=1,2,3
});*/ 


/**
 * app.put("/books/:id", (req, res) => {
  const bookId = req.params.id;
  const q = "UPDATE books SET `title`= ?, `desc`= ?, `price`= ?, `cover`= ? WHERE id = ?";

  const values = [
    req.body.title,
    req.body.desc,
    req.body.price,
    req.body.cover,
  ];
 */