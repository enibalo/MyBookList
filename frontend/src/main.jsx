import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles/index.css";
import UpSign from "./views/UpSign";
import BookAdd from "./views/BookAdd";
import UserSettings from "./views/UserSettings";
import AddRec from "./views/BookComponents/AddRec";
import Browse from "./views/Browse";
import Book from "./views/Book";

//change names of ADD AND UPSIGN!!
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="book/:isbn" element={<Book></Book>}></Route>
        <Route path="settings" element={<UserSettings />}></Route>
        <Route path="signup" element={<UpSign />}></Route>
        <Route path="add-book" element={<BookAdd />}></Route>
        <Route path="browse" element={<Browse />}></Route>
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
      <Route path="add-book" element={<AddBook/>}></Route>
    </Routes>
    </BrowserRouter> */
