import { useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import IndexPage from './pages/IndexPage'
import LoginPage from './pages/LoginPage'
import Layout from './Layout'
import RegisterPage from './pages/registerPage'
import axios from 'axios'


axios.defaults.baseURL = 'http://127.0.0.1:4000';
axios.defaults.withCredentials =true;

function App() {

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<IndexPage/>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route> 
      
    </Routes>
    
  )
}

export default App
