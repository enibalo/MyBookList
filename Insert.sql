
DELETE FROM Tag;
DELETE FROM `User`;
DELETE FROM Publisher;
DELETE FROM Genre;
DELETE FROM Author;
DELETE FROM `Admin`;
DELETE FROM Book;
DELETE FROM Recommendation_tag;
DELETE FROM Recommendation;
DELETE FROM Book_series;
DELETE FROM Posseses;
DELETE FROM Likes;
DELETE FROM Favorites;

INSERT INTO Tag (Name) VALUES
('Enemy to Lover'), ('Evil Parent'), ('Cheezy'), ('Wattpad Era'), ('Cry-athon');

-- User
INSERT INTO `User` (Username, `Password`) VALUES
('bookworm1', 'pass123'),
('readerlove', 'securepas'),
('novelguy', 'bookpass1'),
('storyseek', 'readerpas'),
('pagelover', 'novelpass');

-- Publisher
INSERT INTO Publisher (`Name`, Email, Phone) VALUES
('Penguin Random House', 'info@penguinrand.com', '2127829000'),
('HarperCollins', 'contact@harper.com', '2122077000'),
('Simon & Schuster', 'info@simons.com', '2126987000'),
('Hachette Book Group', 'contact@hachet.com', '2123640100'),
('Macmillan Publishers', 'info@macmill.com', '6462307000');

-- Genre
-- Insert main genres first
INSERT INTO Genre (`Name`, Main_genre) VALUES
('Fiction', NULL),
('Non-Fiction', NULL);

-- Insert sub-genres with 'Fiction' as the main genre for fiction books
INSERT INTO Genre (`Name`, Main_genre) VALUES
('Epic Fantasy', 'Fiction'),
('Space Opera', 'Fiction'),
('Fantasy', 'Fiction'),
('Historical Romance', 'Fiction'),
('Detective Fiction', 'Fiction'),
('Mystery', 'Fiction'),
('Sci-fi', 'Fiction'),
('Thriller', 'Fiction'),
('Horror', 'Fiction'),
('Self-help', 'Non-Fiction'),
('Biography', 'Non-Fiction'),
('History', 'Non-Fiction'),
('Popular Science', 'Non-Fiction'),
('Political Drama', 'Fiction');

-- Author
INSERT INTO Author (ID, Fname, Lname, DOB) VALUES
(1, 'J.R.R.', 'Tolkien', '1892-01-03'),
(2, 'Frank', 'Herbert', '1920-10-08'),
(3, 'Jane', 'Austen', '1775-12-16'),
(4, 'Agatha', 'Christie', '1890-09-15'),
(5, 'Stephen', 'Hawking', '1942-01-08');

-- Admin
INSERT INTO `Admin` (Username, `Password`) VALUES
('admin1', 'adminpass1'),
('superuser', 'superpass2');

-- Book
INSERT INTO Book (ISBN, Title, Purchase_link, Author_id, Publisher_name, Summary) VALUES
(9780261103252, 'The Lord of the Rings', 'https://www.amazon.com/Lord-Rings-J-R-R-Tolkien/dp/0261103253', 1, 'HarperCollins', 'An epic high-fantasy novel set in Middle-earth, following the hobbit Frodo Baggins as he and the Fellowship embark on a quest to destroy the One Ring.'),
(9780441172719, 'Dune', 'https://www.amazon.com/Dune-Frank-Herbert/dp/0441172717', 2, 'Penguin Random House', 'A science fiction masterpiece set on the desert planet Arrakis, following Paul Atreides as he becomes involved in a complex struggle for control of the planet and its valuable spice melange.'),
(9780141439518, 'Pride and Prejudice', 'https://www.amazon.com/Pride-Prejudice-Jane-Austen/dp/0141439513', 3, 'Penguin Random House', 'A classic romance novel following the spirited Elizabeth Bennet as she deals with issues of manners, upbringing, morality, and marriage in early 19th-century England.'),
(9780062073488, 'Murder on the Orient Express', 'https://www.amazon.com/Murder-Orient-Express-Hercule-Mysteries/dp/0062073494', 4, 'HarperCollins', 'A famous detective novel featuring Hercule Poirot, who must solve a murder that occurred on the Orient Express train.'),
(9780553380163, 'A Brief History of Time', 'https://www.amazon.com/Brief-History-Time-Stephen-Hawking/dp/0553380168', 5, 'Simon & Schuster', 'A landmark volume in science writing by one of the great minds of our time, exploring such profound questions as: How did the universe begin—and what made its start possible?');

-- Recommendation_tag
INSERT INTO Recommendation_tag (Tag_name, Username, Book_isbn, Recommended_isbn) VALUES
('Cry-athon', 'bookworm1', 9780261103252, 9780441172719),
('Cry-athon', 'readerlove', 9780441172719, 9780553380163),
('Enemy to Lover', 'novelguy', 9780141439518, 9780062073488),
('Evil Parent', 'storyseek', 9780062073488, 9780141439518),
('Cheezy', 'pagelover', 9780553380163, 9780261103252);

-- Recommendation
INSERT INTO Recommendation (Username, Book_isbn, Recommended_isbn, `Comment`, Up_vote, Down_vote) VALUES
('bookworm1', 9780261103252, 9780441172719, 'If you enjoy epic world-building, Dune is a must-read!', 15, 2),
('readerlove', 9780441172719, 9780553380163, 'For more mind-bending concepts, check out A Brief History of Time.', 10, 1),
('novelguy', 9780141439518, 9780062073488, 'If you like strong characters and plot twists, try this Christie classic.', 8, 3),
('storyseek', 9780062073488, 9780141439518, 'For witty dialogue and social commentary, Pride and Prejudice is excellent.', 12, 0),
('pagelover', 9780553380163, 9780261103252, 'For a change of pace, dive into this fantasy epic.', 7, 1);

-- Book_series
INSERT INTO Book_series (Book_isbn, Series_name, Book_order) VALUES
(9780261103252, 'The Lord of the Rings', 1),
(9780441172719, 'Dune Chronicles', 1);

-- Posseses
INSERT INTO Posseses (Book_isbn, Genre_name) VALUES
(9780261103252, 'Epic Fantasy'),
(9780441172719, 'Space Opera'),
(9780141439518, 'Historical Romance'),
(9780062073488, 'Detective Fiction'),
(9780553380163, 'Popular Science'),
(9780261103252, 'Political Drama');

-- Likes
INSERT INTO Likes (Username, Genre_name) VALUES
('bookworm1', 'Epic Fantasy'),
('bookworm1', 'Political Drama'),
('readerlove', 'Space Opera'),
('novelguy', 'Historical Romance'),
('novelguy', 'Political Drama'),
('storyseek', 'Detective Fiction'),
('pagelover', 'Popular Science'),
('pagelover', 'Epic Fantasy');

-- Favorites
INSERT INTO Favorites (Username, Book_isbn) VALUES
('admin1', 9780261103252),
('superuser', 9780441172719),
('admin1', 9780553380163);


-- So we can demonstrate filtering reccomednations based on genres, i added more insert statements 

INSERT INTO Book (ISBN, Title, Purchase_link, Author_id, Publisher_name, Summary) VALUES
(9780547928227, 'The Hobbit', 'https://www.amazon.com/Hobbit-J-R-Tolkien/dp/054792822X', 1, 'HarperCollins', 'A fantasy novel about hobbit Bilbo Baggins who joins a group of dwarves on a quest to reclaim their mountain home from a dragon.'),
(9780553103540, 'A Game of Thrones', 'https://www.amazon.com/Game-Thrones-Song-Fire-Book/dp/0553103547', 1, 'Penguin Random House', 'The first book in the epic fantasy series A Song of Ice and Fire, set in a world of political intrigue and magical forces.'),
(9780765311788, 'Mistborn: The Final Empire', 'https://www.amazon.com/Mistborn-Final-Empire-Book-No/dp/0765311785', 1, 'Macmillan Publishers', 'A fantasy novel set in a world where certain people can use ingested metals to gain superhuman abilities.'),
(9780441013593, 'Dune Messiah', 'https://www.amazon.com/Dune-Messiah-Frank-Herbert/dp/0441013597', 2, 'Penguin Random House', 'The second book in the Dune series, continuing the story of Paul Atreides as he navigates the complexities of his new role.'),
(9780441104024, 'Children of Dune', 'https://www.amazon.com/Children-Dune-Frank-Herbert/dp/0441104029', 2, 'Penguin Random House', 'The third book in the Dune series, focusing on the twin children of Paul Atreides and their roles in shaping the future of Arrakis.');

INSERT INTO Posseses (Book_isbn, Genre_name) VALUES
(9780547928227, 'Epic Fantasy'),
(9780553103540, 'Epic Fantasy'),
(9780553103540, 'Political Drama'),
(9780765311788, 'Epic Fantasy'),
(9780441013593, 'Space Opera'),
(9780441013593, 'Political Drama'),
(9780441104024, 'Space Opera'),
(9780441104024, 'Political Drama');


INSERT INTO Recommendation (Username, Book_isbn, Recommended_isbn, `Comment`, Up_vote, Down_vote) VALUES 
('bookworm1', 9780261103252, 9780547928227, 'If you loved The Lord of the Rings, you must read The Hobbit! It''s the perfect prequel.', 0, 0),
('readerlove', 9780261103252, 9780553103540, 'For another epic fantasy with complex world-building, try A Game of Thrones.', 18, 3),
('novelguy', 9780261103252, 9780765311788, 'Mistborn has a unique magic system and great character development. Highly recommended for LOTR fans!', 15, 2),
('storyseek', 9780441172719, 9780441013593, 'Continue the Dune saga with Dune Messiah. It''s a great follow-up to the first book.', 12, 1),
('pagelover', 9780441172719, 9780441104024, 'Children of Dune expands the universe even further. A must-read for Dune fans!', 10, 2),
('pagelover', 9780441172719, 9780553103540, 'If you enjoy the political aspects of Dune, you''ll love A Game of Thrones.', 8, 1);


INSERT INTO Tag (`Name`) VALUES
('Cozy'),
('Adventure'),
('Complex World'),
('Unique Magic'),
('Character Dev'),
('Political Intrigue');

-- Insert recommendation tags
INSERT INTO Recommendation_tag (Tag_name, Username, Book_isbn, Recommended_isbn) VALUES
('Cozy', 'bookworm1', 9780261103252, 9780547928227),
('Adventure', 'bookworm1', 9780261103252, 9780547928227),
('Cozy', 'readerlove', 9780261103252, 9780553103540),
('Complex World', 'readerlove', 9780261103252, 9780553103540),
('Cozy', 'novelguy', 9780261103252, 9780765311788),
('Unique Magic', 'novelguy', 9780261103252, 9780765311788),
('Character Dev', 'novelguy', 9780261103252, 9780765311788),
('Wattpad Era', 'storyseek', 9780441172719, 9780441013593),
('Wattpad Era', 'pagelover', 9780441172719, 9780441104024),
('Political Intrigue', 'pagelover', 9780441172719, 9780553103540),
('Cozy', 'pagelover', 9780441172719, 9780553103540);
