import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import './styles/index.css';
import Book from './views/Book';
import AddRec from './views/BookComponents/AddRec.jsx';
import EditRec from './views/BookComponents/EditRec.jsx';
import DefaultRec from './views/BookComponents/DefaultRec.jsx';
import FilterRec from './views/BookComponents/FilterRec.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <BrowserRouter>
  <Routes>  
    <Route path="book/:isbn" element={<Book></Book>}>
      <Route path="add" element={<AddRec></AddRec>}></Route>
      <Route path="edit" element={<EditRec></EditRec>}></Route>
      <Route path="filter" element={<FilterRec></FilterRec>}></Route>
      <Route path="default" element={<DefaultRec></DefaultRec>}></Route>
    </Route>
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