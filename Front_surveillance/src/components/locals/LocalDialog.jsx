// LocalDialog.jsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel
} from '@mui/material';
import axios from 'axios';

const LocalDialog = ({ open, onClose, local, onSave }) => {
  const [formData, setFormData] = useState({
    nom: '',
    taille: '',
    type: 'SALLE'
  });

  useEffect(() => {
    if (local) {
      setFormData({
        nom: local.nom,
        taille: local.taille.toString(),
        type: local.type
      });
    } else {
      setFormData({
        nom: '',
        taille: '',
        type: 'SALLE'
      });
    }
  }, [local]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      const data = {
        ...formData,
        taille: parseInt(formData.taille)
      };

      if (local) {
        await axios.put(`http://localhost:8080/api/locals/${local.id}`, data);
      } else {
        await axios.post('http://localhost:8080/api/locals', data);
      }
      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving local:', error);
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
        {local ? 'Modifier Local' : 'Nouveau Local'}
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
          name="taille"
          label="Taille"
          type="number"
          fullWidth
          value={formData.taille}
          onChange={handleChange}
          sx={{ mb: 3 }}
        />
        <FormControl component="fieldset">
          <FormLabel component="legend">Type</FormLabel>
          <RadioGroup
            name="type"
            value={formData.type}
            onChange={handleChange}
          >
            <FormControlLabel value="SALLE" control={<Radio />} label="Salle" />
            <FormControlLabel value="AMPHI" control={<Radio />} label="Amphi" />
          </RadioGroup>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button 
          onClick={handleSubmit}
          variant="contained"
          disabled={!formData.nom || !formData.taille}
        >
          {local ? 'Modifier' : 'Créer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LocalDialog;