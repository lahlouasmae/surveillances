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

const ModuleDialog = ({ open, onClose, module, optionId, onSave }) => {
  const [teachers, setTeachers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    teacherId: '',
    optionId: optionId
  });

  useEffect(() => {
    if (module) {
      setFormData({
        name: module.name,
        teacherId: module.teacher?.id || '',
        optionId: optionId
      });
    } else {
      setFormData({
        name: '',
        teacherId: '',
        optionId: optionId
      });
    }
  }, [module, optionId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSubmit = async () => {
    try {
      const moduleData = {
        name: formData.name,
        optionId: optionId,
      };

      if (module) {
        await axios.put(`http://localhost:8080/api/modules/${module.id}`, moduleData);
      } else {
        await axios.post('http://localhost:8080/api/modules', moduleData);
      }
      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving module:', error);
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
        {module ? 'Modifier Module' : 'Nouveau Module'}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="name"
          label="Nom du Module"
          fullWidth
          value={formData.name}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button 
          onClick={handleSubmit}
          variant="contained"
          disabled={!formData.name}
        >
          {module ? 'Modifier' : 'Créer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModuleDialog;