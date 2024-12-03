import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles/index.css";
import UpSign from "./views/UpSign";
import BookAdd from "./views/BookAdd";
import UserSettings from "./views/UserSettings";
import AddRec from "./views/BookComponents/AddRec";
import Login from "./views/Login";
import AdminSettings from "./views/AdminSettings";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
      <Route path="add-Book" element={<BookAdd/>}></Route>
      <Route path="signup" element={<UpSign/>}></Route>
      <Route path="settings" element={<UserSettings/>}></Route>
      <Route path="adminSettings" element={<AdminSettings/>}></Route>

      <Route path="/" element={<Login/>}></Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);

/** <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login/>}></Route>
      <Route path="settings" element={<UserSettings/>}></Route>
      <Route path="signup" element={<SignUp/>}></Route>
      <Route path="browse" element={<Browse/>}></Route>
      <Route path="book" element={<Book></Book>}></Route>
      <Route path="addBook" element={<AddBook/>}></Route>
    </Routes>
    </BrowserRouter> */
