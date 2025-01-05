// TeacherDialog.jsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import axios from 'axios';

const TeacherDialog = ({ open, onClose, teacher, departmentId, onSave }) => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    dispense: false,
    departmentId: departmentId || null
  });

  useEffect(() => {
    if (teacher) {
      setFormData({
        nom: teacher.nom,
        prenom: teacher.prenom,
        email: teacher.email,
        dispense: teacher.dispense,
        departmentId: departmentId || teacher.department?.id
      });
    } else {
      setFormData({
        nom: '',
        prenom: '',
        email: '',
        dispense: false,
        departmentId: departmentId || null
      });
    }
  }, [teacher, departmentId]);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'dispense' ? checked : value
    }));
  };

  const handleSubmit = async () => {
    try {
      console.log('Form data:', formData);
      if (teacher) {
        await axios.put(`http://localhost:8080/api/teachers/${teacher.id}`, formData);
      } else {
        await axios.post('http://localhost:8080/api/teachers', formData);
      }
      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving teacher:', error);
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
        {teacher ? 'Modifier Enseignant' : 'Nouvel Enseignant'}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="nom"
          label="Nom"
          fullWidth
          value={formData.nom}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <TextField
          margin="dense"
          name="prenom"
          label="Prénom"
          fullWidth
          value={formData.prenom}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <TextField
          margin="dense"
          name="email"
          label="Email"
          fullWidth
          value={formData.email}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.dispense}
              onChange={handleChange}
              name="dispense"
            />
          }
          label="Dispensé"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button 
          onClick={handleSubmit}
          variant="contained"
          disabled={!formData.nom || !formData.prenom || !formData.email}
        >
          {teacher ? 'Modifier' : 'Créer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TeacherDialog;