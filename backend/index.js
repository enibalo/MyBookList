import express from "express"
import mysql from "mysql"
import cors from "cors"

require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json());

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

/*
tableName = string
attributes = array of strings 
*/ 
function add(req,res, tableName, attributes){
    const query = "INSERT INTO ? WHERE VALUES(?)";
    db.query(query, [tableName, attributes], (err, data)=>{
        if (err) {
            return  res.json(err)
        }else {
            return res.json(data)
        }
    })
}

/**
 * tableName = string
 * whereClause = list of objects. where the column name is the key and value is the column value 
 */

function my_delete(req,res, tableName, whereClause){
    const query = "DELETE FROM ? WHERE ?";
    db.query(query, [tableName, whereClause], (err, data)=>{
        if (err) {
            return  res.json(err)
        }else {
            return res.json(data)
        }
    })

}

/**
 * tableName = string
 * attributes = array of strings 
 * whereClause = list of objects. where the column name is the key and value is the column value 
 */


//get GENRES of a book, get all tags,
//getAllInfoBook  
//addRecommendation
//getAllInfoRecc
//getallinfoLikeRecc.
//getUserReccomendPosts
//upvote/downvote (user can not spam like or downvote)
function get(req,res, tableName, attributes, whereClause){
    const query = "SELECT ? FROM ? WHERE ?";
    db.query(query, [attributes, tableName, whereClause], (err, data)=>{
        if (err) {
            return  res.json(err)
        }else {
            return res.json(data)
        }
    })

}

/**
 * tableName = string
 * attributes = list of objects. where the column name is the key and  the column value is the value 
 * whereClause = list of objects. where the column name is the key and  the column value is the value
 */

function modify(req,res, tableName, attributes, whereClause){
    const query = "UPDATE ? SET ?  WHERE ?";
    db.query(query, [ tableName, attributes, whereClause], (err, data)=>{
        if (err) {
            return  res.json(err)
        }else {
            return res.json(data)
        }
    })

}


/*
isbn - string
 */
function getInfoBook(req,res, isbn){
    const query = `SELECT Book.ISBN, Title, Purchase_link, Publisher_name, Summary, Fname, Lname, Series_name, Username, Book_order
FROM (Book JOIN Author ON Book.Author_id = Author.ID ) LEFT OUTER JOIN Book_series ON
Book_series.Book_isbn=Book.ISBN ) LEFT OUTER JOIN Favorites ON Favorites.Book_isbn=Book.ISBN
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

/*
isbn - string
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

/*
isbn - string
username - string
 */
function getAllLikeInfoRecommendation(req,res, isbn, username){
    const query = `SELECT Book_isbn, Recommended_isbn, Comment, Up_vote, Down_vote, Username, Title, Fname, Lname FROM (Recommendation JOIN Book ON Book.ISBN=Recommended_isbn) JOIN  Author ON Author.ID=Book..Author_id) WHERE   Book_isbn= ?AND Recommended_isbn IN 
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

/*
book_isbn - string
recommended_isbn - string
username - string
 */
function getUsernameTag(req,res){
    const query = `SELECT \`Name\`, Username AS Selected FROM Tag LEFT OUTER JOIN Recommendation_tag  ON 
    Tag_name= \'Name\` WHERE Username=@username AND Book_isbn=@Book_isbn AND Recommended_isbn=@Recommended_isbn`;
    db.query(query, [username, book_isbn, recommended_isbn ], (err, data)=>{
        if (err) {
            return  res.json(err)
        }else {
            return res.json(data)
        }
    })

}





const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "My_book_list",
});

app.get("/", (req,res)=>{
    res.json("hello this is the backend");
});

app.get("/books", (req,res) => {
    const query = "SELECT * FROM Book";
    all(req,res);
});

app.listen(8800, ()=> {
    console.log("Connected to the backend!");
});


