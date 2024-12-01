-- INSERT INTO Genre (`Name`, Main_genre) VALUES
-- ('Political Drama', 'Fiction');

-- INSERT INTO Posseses (Book_isbn, Genre_name) VALUES
-- (9780261103252, 'Political Drama');



-- SELECT Book.ISBN, Title, Purchase_link, Publisher_name, Summary, Fname, Lname, Series_name, Username, Book_order,
-- JSON_ARRAYAGG(Genre_name) AS `Genre`
-- FROM ( ( (Book JOIN Author ON Book.Author_id = Author.ID ) LEFT OUTER JOIN Book_series ON
-- Book_series.Book_isbn=Book.ISBN ) LEFT OUTER JOIN Favorites ON Favorites.Book_isbn=Book.ISBN)
-- JOIN Posseses ON Posseses.Book_isbn=Book.ISBN
-- WHERE Book.ISBN= 9780261103252
-- GROUP BY Book.ISBN;

SELECT * FROM recommendation;
SELECT * FROM recommendation_tag;
-- SELECT Book_isbn, Recommended_isbn, `Comment`, Up_vote, Down_vote, Username, Title, Fname, Lname, 
-- JSON_ARRAYAGG(Tag_name) AS `Tag`
-- FROM ((Recommendation JOIN Book ON Book.ISBN=Recommended_isbn) JOIN  Author ON Author.ID=Book.Author_id) 
-- NATURAL JOIN Recommendation_tag
-- WHERE Book_isbn= 9780261103252 AND Recommended_isbn IN 
-- (SELECT PS.Book_isbn FROM Posseses AS PS NATURAL JOIN Likes AS LS WHERE Username= 'novelguy'  )
-- GROUP BY Book_isbn, Recommended_isbn,Username;

-- SELECT Book_isbn, Recommended_isbn, `Comment`, Up_vote, Down_vote, Username, Title, Fname, Lname, 
-- JSON_ARRAYAGG(Tag_name) AS `Tag`
-- FROM ((Recommendation JOIN Book ON Book.ISBN=Recommended_isbn) JOIN  Author ON Author.ID=Book.Author_id) 
-- NATURAL JOIN Recommendation_tag
-- WHERE Book_isbn= 9780261103252
-- GROUP BY Book_isbn, Recommended_isbn,Username;

--

-- SELECT Book_isbn, Recommended_isbn, `Comment`, Up_vote, Down_vote, Username, Title, Fname, Lname, 
-- (SELECT JSON_ARRAYAGG(T.Tag_name) 
--     FROM Recommendation_tag AS T 
--     WHERE T.Username='bookworm1' AND T.Book_isbn= 9780261103252 AND T.Recommended_isbn=Recommendation.Recommended_isbn) AS `Selected`,
--  (SELECT JSON_ARRAYAGG(`Name`) 
--     FROM Tag 
--     WHERE `Name` NOT IN (SELECT T.Tag_name
--     FROM Recommendation_tag AS T 
--     WHERE T.Username='bookworm1' AND T.Book_isbn= 9780261103252 AND T.Recommended_isbn=Recommendation.Recommended_isbn )) AS `NotSelected`
-- FROM (Recommendation JOIN Book ON Book.ISBN=Recommended_isbn) JOIN  Author ON Author.ID=Book.Author_id
-- WHERE Book_isbn= 9780261103252 AND Username='bookworm1';

-- JSON_ARRAYAGG(attribute) AS attributes
--    -> FROM t3 GROUP BY o_id;




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
 
--- The Lord of the Rings:

---     When filtered by "Epic Fantasy": Users will see recommendations for "The Hobbit", "A Game of Thrones", and "Mistborn: The Final Empire".
---     When filtered by "Political Drama": Users will see a recommendation for "A Game of Thrones".

--- Dune:

---     When filtered by "Space Opera": Users will see recommendations for "Dune Messiah" and "Children of Dune".     
---     When filtered by "Political Drama": Users will see recommendations for "Dune Messiah", "Children of Dune", and "A Game of Thrones".