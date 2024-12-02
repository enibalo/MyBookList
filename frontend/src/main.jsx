import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles/index.css";
import Login from "./views/Login";
import Book from "./views/Book";
 import Browse from "./views/Browse";
//import SignUp from "./views/SignUp";
//import AddBook from "./views/AddBook";
//import UserSettings from "./views/UserSettings";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<Login/>}></Route>
      <Route path="browse" element={<Browse/>}></Route>
      <Route path="book/:isbn" element={<Book></Book>}></Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);

/** <BrowserRouter>
    <Routes>
     
      <Route path="settings" element={<UserSettings/>}></Route>
      <Route path="signup" element={<SignUp/>}></Route>
      <Route path="browse" element={<Browse/>}></Route>
      <Route path="book" element={<Book></Book>}></Route>
      <Route path="addBook" element={<AddBook/>}></Route>
    </Routes>
    </BrowserRouter> */
