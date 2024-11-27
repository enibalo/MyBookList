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
            return  res.json(err)
        }else {
            return res.json(data)
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
            return  res.send(err);
        }else {
            return res.json(data);
        }
    })
}

/**
 * tableName = string,
 * attributes = 2D array of strings, where each sub-array is a row to insert into the table
*/ 
function addNoResponse(tableName, attributes){
    const query = "INSERT INTO ?? VALUES ?";
    return db.query(query, [tableName, attributes], (err, data)=>{
        if (err) {
            console.log(err);
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
            return  res.send(err);
        }else {
            return res.json(data);
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
            return  res.send(err);
        }else {
            return res.json(data);
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
            return  res.send(err);
        }else {
            return res.json(data);
        }
    })

}

/**
 * tableName = string
 * attributes = list of objects. where the column name is the key and  the column value is the value 
 * whereClause = list of objects. where the column name is the key and  the column value is the value
 */

function modifyNoResponse( tableName, attributes, whereClause){
    const query = "UPDATE ?? SET ?  WHERE ?";
    db.query(query, [ tableName, attributes, whereClause], (err, data)=>{
        if (err) {
            console.log(err);
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
            return  res.json(err)
        }else {
            return res.json(data)
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
            return  res.json(err)
        }else {
            return res.json(data)
        }
    })

}

/**
 * isbn - string
 * username - string
 */
function getAllLikeInfoRecommendation(req,res, isbn, username){
    const query = `SELECT Book_isbn, Recommended_isbn, Comment, Up_vote, Down_vote, Username, Title, Fname, Lname FROM (Recommendation JOIN Book ON Book.ISBN=Recommended_isbn) JOIN  Author ON Author.ID=Book..Author_id) WHERE   Book_isbn= ? AND Recommended_isbn IN 
 (SELECT PS.ISBN FROM Possesses AS PS NATURAL JOIN Likes AS LS WHERE Username= ?  )
    `;
    db.query(query, [isbn, username], (err, data)=>{
        if (err) {
            return  res.json(err)
        }else {
            return res.json(data)
        }
    })

} 


/**
 * isbn - string
 */
function getAllInfoRecommendation(req,res, isbn){
    const query = `SELECT Book_isbn, Recommended_isbn, Comment, Up_vote, Down_vote, Username, Title, Fname, Lname FROM 
    (Recommendation JOIN Book ON Book.ISBN=Recommended_isbn) JOIN  Author ON Author.ID=Book.Author_id) WHERE Book_isbn= ?`;

    db.query(query, [isbn], (err, data)=>{
        if (err) {
            return  res.json(err)
        }else {
            return res.json(data)
        }
    })

} 

//NEED TO ADD TO DIAGRAMS
/**
 * values - array of strings 
 */
function getUsernameRecommendations(req,res, values){
    const query = `? ?`;
    db.query(query, values , (err, data)=>{
        if (err) {
            return  res.json(err)
        }else {
            return res.json(data)
        }
    })

}


// get all tags,
app.get("/tag", (req,res)=>{
    get(req,res,"Tag", ["`Name`"], []);

});

//getInfoBook and genres of a book !! ( not done sql)
app.get("/book/:isbn", (req,res) => {
    const isbn = req.params.isbn;
    getInfoBook(req,res,isbn);
}); 

//addRecommendation
app.post("users/:user/book/:isbn/recommendation/:reccIsbn", (req, res)=>{
    const reccValues = [req.body.username,req.body.bookIsbn, req.body.reccIsbn, req.body.comment];
    addNoResponse("Recommendation", [[reccValues]]);
    next();
}, (req,res)=>{
    const tags = req.body.tags.map((tag)=>{ return [tag, req.body.username,req.body.bookIsbn, req.body.reccIsbn]} );
    add("Recommendation_tag", tags);
});

//getAllInfoRecc and //getallinfoLikeRecc. ( not done sql)
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

//getUserPostsForAbook ( NOT DONE sql)
app.get("users/:user/book/:isbn/recommendation", (req,res)=>{
    const user = req.params.user; 
    const isbn = req.params.isbn; 
    getUsernameRecommendations(req,res,"Recommendation",[user,isbn], whereClause);
});

//upvote/downvote (user can not spam like or downvote)
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

//editRecc - NOT DONE TAGS SQL
app.put("users/:user/book/:isbn/recommendation/:reccIsbn", (req,res, next)=>{
    const user = {Username : req.params.user}; 
    const isbn = {Book_isbn : req.params.isbn}; 
    const reccIsbn = {Recommended_isbn : req.params.reccIsbn};; 

    const comment = {Comment : req.body.comment};
    modifyNoResponse("Recommendation", [comment], [user, isbn, reccIsbn], false);
    next();

}, (req,res)=>{
    //not done custom delete and add for tags 
    const user = {Username : req.params.user}; 
    const isbn = {Book_isbn : req.params.isbn}; 
    const reccIsbn = {Recommended_isbn : req.params.reccIsbn};; 

    const tags = req.body.tags.map((tag)=>{ return [tag, req.body.username,req.body.bookIsbn, req.body.reccIsbn]} );
    //modify(req,res,"Recommendation", [downvote], [user, isbn, reccIsbn]);

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