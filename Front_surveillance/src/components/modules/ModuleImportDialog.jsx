// ModuleImportDialog.jsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  LinearProgress,
  Alert
} from '@mui/material';
import { Upload } from '@mui/icons-material';
import axios from 'axios';

const ModuleImportDialog = ({ open, onClose, onImportSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = React.useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/csv') {
      setSelectedFile(file);
      setError(null);
    } else {
      setError('Veuillez sélectionner un fichier CSV valide');
      setSelectedFile(null);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      await axios.post('http://localhost:8080/api/modules/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      onImportSuccess();
      handleClose();
    } catch (error) {
      setError('Une erreur est survenue lors de l\'importation. Veuillez réessayer.');
      console.error('Error importing modules:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setError(null);
    setIsUploading(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Importer des Modules</DialogTitle>
      <DialogContent>
        <Box sx={{ p: 2 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Sélectionnez un fichier CSV contenant les données des modules.
          </Typography>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            style={{ display: 'none' }}
            accept=".csv"
          />
          
          <Box
            sx={{
              border: '2px dashed #ccc',
              borderRadius: 1,
              p: 3,
              textAlign: 'center',
              cursor: 'pointer',
              '&:hover': { borderColor: '#1a237e' },
              mb: 2
            }}
            onClick={() => fileInputRef.current.click()}
          >
            <Upload sx={{ fontSize: 48, color: '#1a237e', mb: 1 }} />
            <Typography variant="body1">
              {selectedFile ? selectedFile.name : 'Cliquez pour sélectionner un fichier CSV'}
            </Typography>
          </Box>

          {isUploading && <LinearProgress sx={{ mt: 2 }} />}
          
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isUploading}>
          Annuler
        </Button>
        <Button
          onClick={handleImport}
          variant="contained"
          disabled={!selectedFile || isUploading}
          sx={{ backgroundColor: '#1a237e' }}
        >
          Importer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModuleImportDialog;