import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  TextField,
  Button,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import { 
  Add, 
  MoreVert, 
  Search,
  Business 
} from '@mui/icons-material';
import axios from 'axios';
import DepartmentDialog from './DepartmentDialog';
import DepartmentImportDialog from './DepartmentImportDialog';
import './DepartmentList.css';


const DepartmentList = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [error, setError] = useState('');
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);



  useEffect(() => {
    fetchDepartments();
  }, []);
  
  const fetchDepartments = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/departments');
      setDepartments(response.data); // Response is already a list of departments
    } catch (err) {
      console.error('Error fetching departments:', err.response || err);
      setError('Failed to load departments');
    }
  };

  const handleOpenDialog = (department = null) => {
    setSelectedDepartment(department);
    setIsDialogOpen(true);
    setAnchorEl(null);
  };

  const handleDepartmentClick = (department) => {
    navigate(`/departments/${department.id}/teachers`, { 
        state: { 
            departmentId: department.id,
            departmentName: department.name 
          }
    });
  };

  const handleOpenImportDialog = () => {
    setIsImportDialogOpen(true);
  };

  const handleCloseImportDialog = () => {
    setIsImportDialogOpen(false);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedDepartment(null);
  };

  const handleDelete = async (departmentId) => {
    try {
      await axios.delete(`http://localhost:8080/api/departments/${departmentId}`);
      fetchDepartments();
      setAnchorEl(null);
    } catch (error) {
      console.error('Error deleting department:', error);
    }
  };

  const handleMenuOpen = (event, department) => {
    setAnchorEl(event.currentTarget);
    setSelectedDepartment(department);
  };

  const filteredDepartments = (Array.isArray(departments) ? departments : []).filter(dept =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  

  return (
    <div className="departmentContainer">
      <div className="header">
        <div className="navigationPath">
          <Business sx={{ fontSize: 18 }} />
          <span>Départements</span>
        </div>
        
        <div className="titleArea">
          <div className="titleContent">
            <h1>Départements</h1>
            <p>Gérer les départements de l'établissement</p>
          </div>
          
          <div className="actionButtons">
            <Button
              variant="outlined"
              onClick={handleOpenImportDialog}
              className="importButton"
            >
              Importer CSV
            </Button>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleOpenDialog()}
              className="addButton"
            >
              Ajouter un département
            </Button>
          </div>
        </div>
      </div>

      <div className="searchContainer">
        <TextField
          fullWidth
          placeholder="Rechercher un département..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="searchField"
          InputProps={{
            startAdornment: <Search sx={{ color: '#94a3b8', mr: 1 }} />
          }}
        />
      </div>

      <div className="departmentGrid">
        {filteredDepartments.length === 0 ? (
          <div className="emptyState">
            <h3>Aucun département trouvé</h3>
            <p>Commencez par ajouter un nouveau département</p>
          </div>
        ) : (
          filteredDepartments.map((department) => (
            <div 
              key={department.id} 
              className="departmentCard"
              onClick={() => handleDepartmentClick(department)}
            >
              <div className="departmentHeader">
                <div className="departmentName">
                  {department.name}
                </div>
                <IconButton 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMenuOpen(e, department);
                  }}
                  className="actionButton"
                >
                  <MoreVert />
                </IconButton>
              </div>
              <div className="departmentInfo">
                <Business sx={{ fontSize: 40, color: '#6366f1', opacity: 0.2 }} />
              </div>
            </div>
          ))
        )}
      </div>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        classes={{
          paper: 'menuPaper'
        }}
      >
        <MenuItem 
          onClick={() => handleOpenDialog(selectedDepartment)}
          className="menuItem"
        >
          Modifier
        </MenuItem>
        <MenuItem 
          onClick={() => handleDelete(selectedDepartment?.id)}
          className="menuItem deleteMenuItem"
        >
          Supprimer
        </MenuItem>
      </Menu>

      <DepartmentDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        department={selectedDepartment}
        onSave={fetchDepartments}
      />
      <DepartmentImportDialog
        open={isImportDialogOpen}
        onClose={handleCloseImportDialog}
        onImportSuccess={fetchDepartments}
      />
    </div>
  );
};

export default DepartmentList;