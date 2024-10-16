import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import './Navbar.css'; 

const MyNavbar = ({ loggedIn, onLogout }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(loggedIn);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (loggedIn) {
      const token = localStorage.getItem('access_token');
      if (token) {
        getUserInfo(token);
      }
    }
  }, [loggedIn]);

  const getUserInfo = async (token) => {
    try {
      const response = await axios.get('http://localhost:8000/api/users/profile/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setIsLoggedIn(true);  // Set logged-in state
      setUsername(response.data.username);  // Update username
    } catch (error) {
      console.error('Error fetching user info', error);
      setIsLoggedIn(false);  // If there's an error, set logged-in state to false
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsLoggedIn(false);
    setUsername('');
    onLogout();  // Trigger the logout handler
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top" className="custom-navbar">
      <Container>
        <Navbar.Brand as={Link} to="/" className="navbar-brand">
          MyEventExpert
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto nav-items">
            <Nav.Link as={Link} to="/" className="nav-link">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/events" className="nav-link">
              Event Dashboard
            </Nav.Link>

            {isLoggedIn ? (
              <NavDropdown title={username} id="basic-nav-dropdown" className="nav-link">
                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="nav-link">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register" className="nav-link">
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MyNavbar;
