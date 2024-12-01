import express from "express"
import mysql from "mysql"
import cors from "cors"

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

const db = mysql.createConnection({
  host:"localhost",
  user: "root",
  password: "Appl8101*",
  database: "My_book_list",
});



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


app.post("/login", (req, res) => {
    console.log("hi");
    const { username, password } = req.body;
    
    req.session.username = username; 
    console.log(username);
    console.log(password);


    // if no username or password, enter error message that says that user name and password arr required 
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }


    // first check if the user is an admin 
    // set the role to admin
    const adminQuery = "SELECT * FROM Admin WHERE Username = ?";
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


    }); 



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





//app.get("/", (req,res)=>{
    //res.json("hello this is the backend");
//});

app.get("/books", (req,res) => {
    const query = "SELECT * FROM Book";
    all(req,res);
});

app.listen(8800, ()=> {
    console.log("Connected to the backend!");
});



