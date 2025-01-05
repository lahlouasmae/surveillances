// src/components/layout/Layout.jsx
import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Box } from '@mui/material';
import {
  Dashboard,
  School,
  SupervisorAccount,
  Work,
  List,
  Business,
  Room,
  Person
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const Layout = ({ children }) => {
  return (
    <Box>
      <AppBar position="static" sx={{ backgroundColor: 'white', color: 'black' }}>
        <Toolbar>
          <img src="/logo.png" alt="Logo" style={{ height: 40, marginRight: 20 }} />
          <Box sx={{ display: 'flex', gap: 2, flexGrow: 1 }}>
            <IconButton component={Link} to="/dashboard" color="inherit">
              <Dashboard />
              <Typography variant="body2" sx={{ ml: 1 }}>Dashboard</Typography>
            </IconButton>
            <IconButton component={Link} to="/exams" color="inherit">
              <School />
              <Typography variant="body2" sx={{ ml: 1 }}>Exams</Typography>
            </IconButton>
            <IconButton component={Link} to="/surveillance" color="inherit">
              <SupervisorAccount />
              <Typography variant="body2" sx={{ ml: 1 }}>Surveillance</Typography>
            </IconButton>
            <IconButton component={Link} to="/emploi" color="inherit">
              <Work />
              <Typography variant="body2" sx={{ ml: 1 }}>Emploi</Typography>
            </IconButton>
            <IconButton component={Link} to="/options" color="inherit">
              <List />
              <Typography variant="body2" sx={{ ml: 1 }}>Options</Typography>
            </IconButton>
            <IconButton component={Link} to="/departments" color="inherit">
              <Business />
              <Typography variant="body2" sx={{ ml: 1 }}>Departments</Typography>
            </IconButton>
            <IconButton component={Link} to="/locaux" color="inherit">
              <Room />
              <Typography variant="body2" sx={{ ml: 1 }}>Locaux</Typography>
            </IconButton>
          </Box>
          <IconButton color="inherit">
            <Person />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 3 }}>
        {children}
      </Box>
    </Box>
  );
};