import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
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
  ChevronRight,
  StarBorder
} from '@mui/icons-material';
import axios from 'axios';
import ModuleDialog from './ModuleDialog';
import ModuleImportDialog from './ModuleImportDialog';
import './ModuleList.css';


const ModuleList = () => {
  const { optionId } = useParams();
  const location = useLocation();
  const [modules, setModules] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const optionName = location.state?.optionName;
  const departmentName = location.state?.departmentName;

  useEffect(() => {
    fetchModules();
  }, [optionId]);

  const fetchModules = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/modules/option/${optionId}`);
      setModules(response.data);
    } catch (error) {
      console.error('Error fetching modules:', error);
    }
  };

  const handleOpenDialog = (module = null) => {
    setSelectedModule(module);
    setIsDialogOpen(true);
    setAnchorEl(null);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedModule(null);
  };

  const handleOpenImportDialog = () => {
    setIsImportDialogOpen(true);
  };

  const handleCloseImportDialog = () => {
    setIsImportDialogOpen(false);
  };

  const handleDelete = async (moduleId) => {
    try {
      await axios.delete(`http://localhost:8080/api/modules/${moduleId}`);
      fetchModules();
      setAnchorEl(null);
    } catch (error) {
      console.error('Error deleting module:', error);
    }
  };

  const handleMenuOpen = (event, module) => {
    setAnchorEl(event.currentTarget);
    setSelectedModule(module);
  };

  const filteredModules = modules.filter(module =>
    module.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="moduleContainer">
      <div className="header">
        <div className="navigationPath">
          {departmentName} <ChevronRight sx={{ fontSize: 18 }} /> <span>{optionName}</span>
        </div>
        
        <div className="titleArea">
          <div className="titleContent">
            <h1>Modules</h1>
            <p>Gérer et organiser les modules de votre option</p>
          </div>
          
          <div className="actionButtons">
            <Button
              variant="outlined"
              onClick={handleOpenImportDialog}
              className="importButton"
              startIcon={<StarBorder />}
            >
              Importer CSV
            </Button>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleOpenDialog()}
              className="addButton"
            >
              Ajouter un module
            </Button>
          </div>
        </div>
      </div>

      <div className="searchContainer">
        <TextField
          fullWidth
          placeholder="Rechercher un module par nom..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="searchField"
          InputProps={{
            startAdornment: <Search sx={{ color: '#94a3b8', mr: 1 }} />
          }}
        />
      </div>

      {filteredModules.length === 0 ? (
        <div className="emptyState">
          <h3>Aucun module trouvé</h3>
          <p>Commencez par ajouter un nouveau module à votre option</p>
        </div>
      ) : (
        <div className="moduleGrid">
          {filteredModules.map((module) => (
            <div key={module.id} className="moduleCard">
              <div className="moduleName">
                {module.name}
              </div>
              {module.credits && (
                <div className="moduleCredits">
                  {module.credits} Crédits
                </div>
              )}
              <div className="moduleActions">
                <IconButton 
                  onClick={(e) => handleMenuOpen(e, module)}
                  className="actionButton"
                >
                  <MoreVert />
                </IconButton>
              </div>
            </div>
          ))}
        </div>
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        classes={{
          paper: 'menuPaper'
        }}
      >
        <MenuItem 
          onClick={() => handleOpenDialog(selectedModule)}
          className="menuItem"
        >
          Modifier
        </MenuItem>
        <MenuItem 
          onClick={() => handleDelete(selectedModule?.id)}
          className="menuItem deleteMenuItem"
        >
          Supprimer
        </MenuItem>
      </Menu>

      <ModuleDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        module={selectedModule}
        optionId={optionId}
        onSave={fetchModules}
      />
      <ModuleImportDialog
        open={isImportDialogOpen}
        onClose={handleCloseImportDialog}
        onImportSuccess={fetchModules}
      />
    </div>
  );
};

export default ModuleList;