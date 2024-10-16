import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import EventsDashboard from './components/Events';
import Login from './components/Login';
import Register from './components/Register';
import MyNavbar from './components/Navbar'; 

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  // Handle login event to update navbar
  const handleLogin = () => {
    setLoggedIn(true);  // Update the login state, forcing Navbar to rerender
  };

  const handleLogout = () => {
    setLoggedIn(false);
  };

  return (
    <Router>
      <MyNavbar loggedIn={loggedIn} onLogout={handleLogout} /> {/* Pass login state to Navbar */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<EventsDashboard />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} /> {/* Pass login handler */}
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
