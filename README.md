How To Run Our Project

1. Download the project from github. (You need to have npm, Vite, express-js installed).
2. Unzip the My_book_list folder.
3. Create a My_book_list database, in MariaDB. Run the the Create.sql, and then Insert.sql file ( both are located in the root My_book_list folder) in MariaDB.
4. cd into backend folder from a terminal, and run npm start. (if command is not recognized please run "fnm env --use-on-cd | Out-String | Invoke-Expression" beforehand, same goes for frontend)
5. cd into frontend folder from a terminal, and run npm run dev.
6. npm run dev, should have also inputted a link like: http://localhost:5173.
7. Copy+paste the link into the browser. Done!

File Structure
(any file other than what is specified here can be ignored )

BackEnd is for our Server.
index.js - all of our backend stuff

Frontend is for the website/user-interface.
Below is the current file structure: <br />
|frontend <br />
&nbsp;&nbsp;|src <br />
&ensp;&ensp; | assets - for pictures <br />
&ensp;&ensp; | components - for reusable components like Header, Login Form, Toggle groups so we don't recreate stuff we share. <br />
&ensp;&ensp; | views - for web pages like Home Page, User Setting Page <br />
&ensp;&ensp; | styles - Is for all of our style sheets.
&nbsp;&nbsp;main.jsx - Controls our current routes.
