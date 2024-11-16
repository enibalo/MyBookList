USE My_book_list;

DROP TABLE IF EXISTS Favorites;
DROP TABLE IF EXISTS Likes;
DROP TABLE IF EXISTS Posseses;
DROP TABLE IF EXISTS Book_series;
DROP TABLE IF EXISTS Recommendation_tag;
DROP TABLE IF EXISTS Recommendation;
DROP TABLE IF EXISTS Book;
DROP TABLE IF EXISTS `Admin`;
DROP TABLE IF EXISTS Author;
DROP TABLE IF EXISTS Genre;
DROP TABLE IF EXISTS Publisher;
DROP TABLE IF EXISTS `User`;
DROP TABLE IF EXISTS Tag;

CREATE TABLE Tag(

    `Name` VARCHAR(20) NOT NULL,
    PRIMARY KEY (`Name`)

);

CREATE TABLE `User`(

        Username VARCHAR(10) NOT NULL,
        `Password` VARCHAR(10) NOT NULL,
        PRIMARY KEY (Username)

);

CREATE TABLE Publisher(		

        `Name` VARCHAR(30) NOT NULL,
        Email VARCHAR(20),
        Phone VARCHAR(10),
        PRIMARY KEY (`Name`)

);


CREATE TABLE Genre(
    `Name` VARCHAR(20) NOT NULL, 
    Main_genre VARCHAR(20),

    PRIMARY KEY(`Name`),
    CONSTRAINT Genre_main FOREIGN KEY (Main_genre) REFERENCES 
    Genre(`Name`) ON DELETE SET NULL ON UPDATE CASCADE  
);

CREATE TABLE Author(
    ID INT NOT NULL, 
    Fname  VARCHAR(15) NOT NULL, 
    Lname VARCHAR(15) NOT NULL, 
    DOB DATE,
    PRIMARY KEY (ID)

);



CREATE TABLE `Admin` (
    Username VARCHAR(10) NOT NULL,  
    Password VARCHAR(10) NOT NULL,
    PRIMARY KEY (Username) 
	
);

CREATE TABLE Book(

    ISBN VARCHAR(13) NOT NULL,
    Title VARCHAR(60) NOT NULL,
    Purchase_link VARCHAR(100),
    Author_id INT,
    Publisher_name VARCHAR(30), 
    Summary VARCHAR(800) NOT NULL,

    PRIMARY KEY (ISBN),

    CONSTRAINT Book_author FOREIGN KEY (Author_id) REFERENCES Author(ID)
    ON DELETE SET NULL ON UPDATE CASCADE,

    CONSTRAINT Book_publisher FOREIGN KEY (Publisher_name) REFERENCES Publisher(`Name`) 
    ON DELETE SET NULL ON UPDATE CASCADE 

);

CREATE TABLE Recommendation(
    Username VARCHAR(10) NOT NULL,
    Book_isbn VARCHAR(13) NOT NULL,
    Recommended_isbn VARCHAR(13) NOT NULL,
    `Comment` VARCHAR(200) NOT NULL,
    Up_vote INT  DEFAULT 0,
    Down_vote INT DEFAULT 0,

    PRIMARY KEY (Username,Book_isbn, Recommended_isbn),


    CONSTRAINT Rec_username FOREIGN KEY (Username) REFERENCES `User`(Username) 
    ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT Rec_book FOREIGN KEY (Book_isbn) REFERENCES Book(ISBN) 
    ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT Rec_recommended FOREIGN KEY (Recommended_isbn) REFERENCES Book(ISBN)
	 ON DELETE CASCADE ON UPDATE CASCADE	
);

CREATE TABLE Recommendation_tag(
    Tag_name VARCHAR(10) NOT NULL,
    Username VARCHAR(10) NOT NULL,
    Book_isbn VARCHAR(13) NOT NULL,
    Recommended_isbn INT NOT NULL,
    PRIMARY KEY (Tag_name,Username,Book_isbn, Recommended_isbn),

    CONSTRAINT Rectag_username FOREIGN KEY (Username) REFERENCES 	`User`(Username) 
    ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT Rectag_tag FOREIGN KEY (Tag_name ) REFERENCES Tag(`Name`) 
    ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT Rectag_book FOREIGN KEY (Book_isbn)  REFERENCES Book(ISBN) 
    ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT Rectag_recommended FOREIGN KEY (Recommended_isbn)  REFERENCES 	Book(ISBN)  ON DELETE CASCADE ON UPDATE CASCADE
);
	
CREATE TABLE Book_series(
    Book_isbn VARCHAR(13) NOT NULL,
    Series_name VARCHAR(60) NOT NULL,
    Book_order INT NOT NULL,

    PRIMARY KEY (Book_isbn),

    CONSTRAINT Book_series_book  FOREIGN KEY (Book_isbn) REFERENCES Book(ISBN) ON DELETE CASCADE ON UPDATE CASCADE 

);

CREATE TABLE Posseses(

        Book_isbn VARCHAR(13) NOT NULL,
        Genre_name VARCHAR(20) NOT NULL,

        PRIMARY KEY (Book_isbn, Genre_name),

        CONSTRAINT Posseses_book  FOREIGN KEY (Book_isbn) REFERENCES Book(ISBN) ON DELETE CASCADE ON UPDATE CASCADE,

        CONSTRAINT Posseses_genre  FOREIGN KEY (Genre_name) REFERENCES Genre(`Name`) ON DELETE CASCADE ON UPDATE CASCADE 

);

CREATE TABLE Likes(

        Username VARCHAR(10) NOT NULL,
        Genre_name VARCHAR(20) NOT NULL,

        PRIMARY KEY (Username, Genre_name),

        CONSTRAINT Likes_username  FOREIGN KEY (Username) REFERENCES User(Username) ON DELETE CASCADE ON UPDATE CASCADE,

        CONSTRAINT Likes_genre  FOREIGN KEY (Genre_name) REFERENCES Genre(`Name`) ON DELETE CASCADE ON UPDATE CASCADE 

);


CREATE TABLE Favorites (
    Username VARCHAR(10) NOT NULL,
    Book_isbn VARCHAR(13) NOT NULL,
    PRIMARY KEY (Username, Book_isbn),

    CONSTRAINT Favourites_username  FOREIGN KEY (Username) REFERENCES User(Username) ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT Favourites_ISBN  FOREIGN KEY (Book_isbn) REFERENCES Book(ISBN) ON DELETE CASCADE ON UPDATE CASCADE
);
	