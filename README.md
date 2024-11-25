BackEnd is for our Database/Server stuff (nothing to see here because we haven't done anything yet)

frontend is for React stuff. 
Below is the current file structure (any file/foldr not included here can be ignored for now):  <br />
    |frontend  <br />
    &nbsp;|src  <br />
    &ensp;  | assets - for pictures  <br />
    &ensp;  | components - for reusable components like Header, Login Form, Toggle groups so we don't recreate stuff we share.   <br />
    &ensp;  | views - for web pages like Home Page, User Setting Page  <br />
    &emsp;      | BookComponents - My web page file was getting kind of long, so I decided to divide it into smaller components to make it easier to code. Feel free to do the same.  <br />
    &ensp;  | styles - Is for all of our style sheets. Our shared styles go in index.css. Each web page gets it's own style sheet for style that is specific to it alone, using module.css. You can look at my file or the picture for reference. (In order to prevent naming conflicts. ) <br />
    &nbsp;main.jsx - Controls our current routes. Use this as a reference: https://www.theodinproject.com/lessons/node-path-react-new-react-router. ( or Instagram). <br />


![alt text](https://github.com/enibalo/MyBookList/blob/df0f2a74df878fad422894dcb4b4e3c4ca32a8f2/frontend/src/assets/image.png)
For more info on css modules: https://www.makeuseof.com/react-components-css-modules-style/
The CSS is the same, the only thing that changes is the file name, and the way you use it in the React file. className={styles.theClassName} id={styles.theIDName}




