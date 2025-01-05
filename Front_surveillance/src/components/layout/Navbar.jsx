import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  School,
  Dashboard,
  Assignment,
  Visibility,
  Business,
  MeetingRoom,
  Category,
  Person,
  Logout,
} from '@mui/icons-material';
import './Navbar.css';
import axios from 'axios';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    username: '',
    role: 'Administrator',
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/users/profile/1');
      setUserInfo({
        username: response.data.username || 'User',
        role: 'Administrator',
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Conserver les valeurs par défaut en cas d'erreur
    }
  };

  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    // Simuler une déconnexion en supprimant un jeton ou des données utilisateur
    localStorage.removeItem('authToken'); // Suppression d'un jeton d'authentification simulé
    navigate('/login'); // Redirection vers la page de connexion
  };

  return (
    <div className="navbar-wrapper">
      <nav className="navbar">
        <div className="nav-brand">
          <School className="brand-icon" />
          <span className="brand-text">ENSAJ</span>
        </div>

        <ul className="nav-links">
          <li>
            <Link to="/dashboard" className={`nav-item ${isActive('/dashboard') ? 'active' : ''}`}>
              <Dashboard className="nav-icon" />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link to="/exams" className={`nav-item ${isActive('/exams') ? 'active' : ''}`}>
              <Assignment className="nav-icon" />
              <span>Exams</span>
            </Link>
          </li>
          <li>
            <Link to="/surveillance" className={`nav-item ${isActive('/surveillance') ? 'active' : ''}`}>
              <Visibility className="nav-icon" />
              <span>Surveillance</span>
            </Link>
          </li>
          <li>
            <Link to="/departments" className={`nav-item ${isActive('/departments') ? 'active' : ''}`}>
              <Business className="nav-icon" />
              <span>Départements</span>
            </Link>
          </li>
          <li>
            <Link to="/locals" className={`nav-item ${isActive('/locals') ? 'active' : ''}`}>
              <MeetingRoom className="nav-icon" />
              <span>Locaux</span>
            </Link>
          </li>
          <li>
            <Link to="/options" className={`nav-item ${isActive('/options') ? 'active' : ''}`}>
              <Category className="nav-icon" />
              <span>Options</span>
            </Link>
          </li>
          <li>
            <Link to="/profile" className={`nav-item ${isActive('/profile') ? 'active' : ''}`}>
              <Person className="nav-icon" />
              <span>Profil</span>
            </Link>
          </li>
          <li>
            <button className="nav-item logout-button" onClick={handleLogout}>
              <Logout className="nav-icon" />
              <span>Déconnexion</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
