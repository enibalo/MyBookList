BackEnd is for our Database/Server stuff (nothing to see here because we haven't done anything yet)

Front End is for React stuff. 
Below is the current file structure (any file/foldr not included here can be ignored for now): 
    |frontend
        |src 
            | assets - for pictures 
            | components - for reusable components like Header, Login Form, Toggle groups so we don't recreate stuff we share.  
            | views - for web pages like Home Page, User Setting Page
                | BookComponents - My web page file was getting kind of long, so I decided to divide it into smaller components to make it easier to code. Feel free to do the same. 
            | styles - Is for all of our style sheets. Our shared styles go in index.css. Each web page gets it's own style sheet for style that is specific to it alone, using module.css. You can look at my file or the picture for reference. (In order to prevent naming conflicts. )
            main.jsx - Controls our current routes. Use this as a reference: https://www.theodinproject.com/lessons/node-path-react-new-react-router. ( or Instagram).


![alt text](image.png)
For more info on css modules: https://www.makeuseof.com/react-components-css-modules-style/




