-- Tag
INSERT INTO Tag (Name) VALUES
('Fantasy'), ('Science Fiction'), ('Romance'), ('Mystery'), ('Non-Fiction');

-- User
INSERT INTO User (Username, Password) VALUES
('bookworm1', 'pass123'),
('readerlove', 'securepass'),
('novelguy', 'bookpass1'),
('storyseeker', 'readerpass'),
('pagelover', 'novelpass');

-- Publisher
INSERT INTO Publisher (Name, Email, Phone) VALUES
('Penguin Random House', 'info@penguinrandom.com', '2127829000'),
('HarperCollins', 'contact@harpercollins.com', '2122077000'),
('Simon & Schuster', 'info@simonschuster.com', '2126987000'),
('Hachette Book Group', 'contact@hachette.com', '2123640100'),
('Macmillan Publishers', 'info@macmillan.com', '6462307000');

-- Genre
INSERT INTO Genre (Name, Main_genre) VALUES
('Epic Fantasy', 'Fantasy'),
('Space Opera', 'Science Fiction'),
('Historical Romance', 'Romance'),
('Detective Fiction', 'Mystery'),
('Popular Science', 'Non-Fiction');

-- Author
INSERT INTO Author (ID, Fname, Lname, DOB) VALUES
(1, 'J.R.R.', 'Tolkien', '1892-01-03'),
(2, 'Frank', 'Herbert', '1920-10-08'),
(3, 'Jane', 'Austen', '1775-12-16'),
(4, 'Agatha', 'Christie', '1890-09-15'),
(5, 'Stephen', 'Hawking', '1942-01-08');

-- Admin
INSERT INTO Admin (Username, Password) VALUES
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
('Fantasy', 'bookworm1', 9780261103252, 9780441172719),
('Science Fiction', 'readerlove', 9780441172719, 9780553380163),
('Romance', 'novelguy', 9780141439518, 9780062073488),
('Mystery', 'storyseeker', 9780062073488, 9780141439518),
('Non-Fiction', 'pagelover', 9780553380163, 9780261103252);

-- Recommendation
INSERT INTO Recommendation (Username, Book_isbn, Recommended_isbn, Comment, Up_vote, Down_vote) VALUES
('bookworm1', 9780261103252, 9780441172719, 'If you enjoy epic world-building, Dune is a must-read!', 15, 2),
('readerlove', 9780441172719, 9780553380163, 'For more mind-bending concepts, check out A Brief History of Time.', 10, 1),
('novelguy', 9780141439518, 9780062073488, 'If you like strong characters and plot twists, try this Christie classic.', 8, 3),
('storyseeker', 9780062073488, 9780141439518, 'For witty dialogue and social commentary, Pride and Prejudice is excellent.', 12, 0),
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
(9780553380163, 'Popular Science');

-- Likes
INSERT INTO Likes (Username, Genre_name) VALUES
('bookworm1', 'Epic Fantasy'),
('readerlove', 'Space Opera'),
('novelguy', 'Historical Romance'),
('storyseeker', 'Detective Fiction'),
('pagelover', 'Popular Science');

-- Favorites
INSERT INTO Favorites (Username, Book_isbn) VALUES
('bookworm1', 9780261103252),
('readerlove', 9780441172719),
('novelguy', 9780141439518),
('storyseeker', 9780062073488),
('pagelover', 9780553380163);