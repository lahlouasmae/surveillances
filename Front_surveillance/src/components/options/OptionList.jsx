// OptionList.jsx
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
  School
} from '@mui/icons-material';
import axios from 'axios';
import OptionDialog from './OptionDialog';
import OptionImportDialog from './OptionImportDialog';
import './OptionList.css';
 

const OptionList = () => {
  const navigate = useNavigate();
  const [options, setOptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);

  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/options');
      setOptions(response.data);
    } catch (error) {
      console.error('Error fetching options:', error);
    }
  };

  const handleOpenDialog = (option = null) => {
    setSelectedOption(option);
    setIsDialogOpen(true);
    setAnchorEl(null);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedOption(null);
  };
  const handleOpenImportDialog = () => {
    setIsImportDialogOpen(true);
  };

  const handleCloseImportDialog = () => {
    setIsImportDialogOpen(false);
  };

  const handleDelete = async (optionId) => {
    try {
      await axios.delete(`http://localhost:8080/api/options/${optionId}`);
      fetchOptions();
      setAnchorEl(null);
    } catch (error) {
      console.error('Error deleting option:', error);
    }
  };

  const handleMenuOpen = (event, option) => {
    setAnchorEl(event.currentTarget);
    setSelectedOption(option);
  };

  const handleOptionClick = (option) => {
    navigate(`/options/${option.id || ''}/modules`, { // Use || to avoid crashing
      state: { 
        optionName: option.name || 'Unknown Option', // Default to 'Unknown Option'
      }
    });
  };
  

  const filteredOptions = options.filter(option =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="optionContainer">
      <div className="header">
        <div className="navigationPath">
          <School sx={{ fontSize: 18 }} /> 
          <span>Options d'études</span>
        </div>
        
        <div className="titleArea">
          <div className="titleContent">
            <h1>Options</h1>
            <p>Gérer et organiser les options de formation</p>
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
              Ajouter une option
            </Button>
          </div>
        </div>
      </div>

      <div className="searchContainer">
        <TextField
          fullWidth
          placeholder="Rechercher une option par nom..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="searchField"
          InputProps={{
            startAdornment: <Search sx={{ color: '#94a3b8', mr: 1 }} />
          }}
        />
      </div>

      {filteredOptions.length === 0 ? (
        <div className="emptyState">
          <h3>Aucune option trouvée</h3>
          <p>Commencez par ajouter une nouvelle option</p>
        </div>
      ) : (
        <div className="optionGrid">
          {filteredOptions.map((option) => (
            <div 
              key={option.id} 
              className="optionCard"
              onClick={() => handleOptionClick(option)}
            >
              <div className="optionName">
                {option.name}
              </div>
              <div className="optionActions">
                <IconButton 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMenuOpen(e, option);
                  }}
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
          onClick={() => handleOpenDialog(selectedOption)}
          className="menuItem"
        >
          Modifier
        </MenuItem>
        <MenuItem 
          onClick={() => handleDelete(selectedOption?.id)}
          className="menuItem deleteMenuItem"
        >
          Supprimer
        </MenuItem>
      </Menu>

      <OptionDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        option={selectedOption}
        onSave={fetchOptions}
      />
      <OptionImportDialog
        open={isImportDialogOpen}
        onClose={handleCloseImportDialog}
        onImportSuccess={fetchOptions}
      />
    </div>
  );
};

export default OptionList;