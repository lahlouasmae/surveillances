// OptionDialog.jsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import axios from 'axios';

const OptionDialog = ({ open, onClose, option, onSave }) => {
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    departmentId: ''
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (option) {
      setFormData({
        name: option.name || '', // If name is missing, use an empty string
        departmentId: option.department?.id || '' // Use ? to check if department exists
      });
    } else {
      setFormData({
        name: '',
        departmentId: ''
      });
    }
  }, [option]);
  

  const fetchDepartments = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/departments');
      setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      if (option) {
        await axios.put(`http://localhost:8080/api/options/${option.id}`, formData);
      } else {
        await axios.post('http://localhost:8080/api/options', formData);
      }
      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving option:', error);
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
        {option ? 'Modifier Option' : 'Nouvelle Option'}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="name"
          label="Nom"
          fullWidth
          value={formData.name}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <FormControl fullWidth>
          <InputLabel>Département</InputLabel>
          <Select
            name="departmentId"
            value={formData.departmentId}
            label="Département"
            onChange={handleChange}
          >
            {departments.map(department => (
              <MenuItem key={department.id} value={department.id}>
                {department.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button 
          onClick={handleSubmit}
          variant="contained"
          disabled={!formData.name || !formData.departmentId}
        >
          {option ? 'Modifier' : 'Créer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OptionDialog;