import { useState } from 'react'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Home from './components/Home'
import User from './components/User'
import Public from './components/public'
import JournalEntry from './components/JournalEntry'

import Header from './components/Header/header'
import Footer from './components/Footer/footer'
import Admin from './components/Admin'
import './App.css'

function App() {
  

  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/user" element={<User />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/public" element={<Public />} />
          <Route path="/journal" element={<JournalEntry />} />
        </Routes>
        <Footer />
      </Router>
    </>
  )
}

export default App
