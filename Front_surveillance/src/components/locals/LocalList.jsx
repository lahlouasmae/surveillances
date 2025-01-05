import React, { useState, useEffect } from 'react';
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
  LocationOn
} from '@mui/icons-material';
import axios from 'axios';
import LocalDialog from './LocalDialog';
import LocalImportDialog from './LocalImportDialog';
import './LocalList.css';

const LocalList = () => {
  const [locals, setLocals] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedLocal, setSelectedLocal] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);


  useEffect(() => {
    fetchLocals();
  }, []);

  const fetchLocals = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/locals');
      setLocals(response.data);
    } catch (error) {
      console.error('Error fetching locals:', error);
    }
  };

  const handleOpenDialog = (local = null) => {
    setSelectedLocal(local);
    setIsDialogOpen(true);
    setAnchorEl(null);
  };

  const handleOpenImportDialog = () => {
    setIsImportDialogOpen(true);
  };

  const handleCloseImportDialog = () => {
    setIsImportDialogOpen(false);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedLocal(null);
  };

  const handleDelete = async (localId) => {
    try {
      await axios.delete(`http://localhost:8080/api/locals/${localId}`);
      fetchLocals();
      setAnchorEl(null);
    } catch (error) {
      console.error('Error deleting local:', error);
    }
  };

  const handleMenuOpen = (event, local) => {
    setAnchorEl(event.currentTarget);
    setSelectedLocal(local);
  };

  const filteredLocals = locals.filter(local =>
    local.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="localContainer">
      <div className="header">
        <div className="navigationPath">
          <LocationOn sx={{ fontSize: 18 }} />
          <span>Gestion des Locaux</span>
        </div>
        
        <div className="titleArea">
          <div className="titleContent">
            <h1>Locaux</h1>
            <p>Gérer et organiser les salles et amphithéâtres</p>
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
              Ajouter un local
            </Button>
          </div>
        </div>
      </div>

      <div className="searchContainer">
        <TextField
          fullWidth
          placeholder="Rechercher un local..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="searchField"
          InputProps={{
            startAdornment: <Search sx={{ color: '#94a3b8', mr: 1 }} />
          }}
        />
      </div>

      {filteredLocals.length === 0 ? (
        <div className="emptyState">
          <h3>Aucun local trouvé</h3>
          <p>Commencez par ajouter un nouveau local</p>
        </div>
      ) : (
        <div className="localGrid">
          {filteredLocals.map((local) => (
            <div key={local.id} className="localCard">
              <div className="localHeader">
                <div className="localName">
                  {local.nom}
                </div>
                <IconButton 
                  onClick={(e) => handleMenuOpen(e, local)}
                  className="actionButton"
                >
                  <MoreVert />
                </IconButton>
              </div>
              
              <div className="localDetails">
                <div className="detailItem">
                  <span className="detailLabel">Taille</span>
                  <span className="detailValue">{local.taille}</span>
                </div>
                <div className="detailItem">
                  <span className="detailLabel">Type</span>
                  <span className="typeTag">{local.type}</span>
                </div>
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
          onClick={() => handleOpenDialog(selectedLocal)}
          className="menuItem"
        >
          Modifier
        </MenuItem>
        <MenuItem 
          onClick={() => handleDelete(selectedLocal?.id)}
          className="menuItem deleteMenuItem"
        >
          Supprimer
        </MenuItem>
      </Menu>

      <LocalDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        local={selectedLocal}
        onSave={fetchLocals}
      />
      <LocalImportDialog
        open={isImportDialogOpen}
        onClose={handleCloseImportDialog}
        onImportSuccess={fetchLocals}
      />
    </div>
  );
};

export default LocalList;