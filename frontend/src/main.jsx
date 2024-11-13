import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter, Routes, Route} from "react-router-dom"
import './styles/index.css'
import Login from './views/Login.jsx'
import UserSettings from './views/UserSettings.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login/>}></Route>
      <Route path="/settings" element={<UserSettings/>}></Route>
      <Route path="/signup" element={<SignUp/>}></Route>
      <Route path="/search" element={<Search/>}></Route>
      <Route path="/book" element={<Book/>}></Route>
      <Route path="/addBook" element={<AddBook/>}></Route>
    </Routes>
    </BrowserRouter>
  </StrictMode>,
)
