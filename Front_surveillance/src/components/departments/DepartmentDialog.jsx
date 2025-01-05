import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField
} from '@mui/material';
import axios from 'axios';

const DepartmentDialog = ({ open, onClose, department, onSave }) => {
  const [departmentName, setDepartmentName] = useState('');

  useEffect(() => {
    if (department) {
      setDepartmentName(department.name);
    } else {
      setDepartmentName('');
    }
  }, [department]);

  const handleSubmit = async () => {
    try {
      if (department) {
        // Update existing department
        await axios.put(`http://localhost:8080/api/departments/${department.id}`, {
          name: departmentName
        });
      } else {
        // Create new department
        await axios.post('http://localhost:8080/api/departments', {
          name: departmentName
        });
      }
      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving department:', error);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        {department ? 'Modifier Département' : 'Nouveau Département'}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Nom du département"
          fullWidth
          value={departmentName}
          onChange={(e) => setDepartmentName(e.target.value)}
          placeholder="Entrez le nom du département"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button 
          onClick={handleSubmit}
          variant="contained"
          disabled={!departmentName.trim()}
        >
          {department ? 'Modifier' : 'Créer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DepartmentDialog;