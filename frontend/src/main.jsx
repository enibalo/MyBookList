import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles/index.css";
import UpSign from "./views/UpSign";
import BookAdd from "./views/BookAdd";
import UserSettings from "./views/UserSettings";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
      <Route path="settings" element={<UserSettings />} />
      <Route path="addBook" element={<BookAdd />} />
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
