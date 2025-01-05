import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Avatar,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Person, Lock, DeleteOutline } from '@mui/icons-material';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    fullname: ''
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordError, setPasswordError] = useState("");


  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/users/profile/1');
      setProfile(response.data);
    } catch (err) {
      setError('Failed to load profile');
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put('http://localhost:8080/api/users/profile/1', profile);
      setProfile(response.data);
      setSuccess('Profile updated successfully');
      setIsEditMode(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError(""); // Réinitialise les erreurs précédentes
  
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Les mots de passe ne correspondent pas");
      return;
    }
  
    try {
      await axios.put("http://localhost:8080/api/users/password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setSuccess("Mot de passe changé avec succès");
      setIsChangePasswordOpen(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error("Failed to change password:", err);
      setPasswordError("Erreur lors du changement de mot de passe");
    }
  };
  

  const handleDeleteAccount = async () => {
    try {
      await axios.delete('http://localhost:8080/api/users/account');
      // Redirect to login page or handle logout
      window.location.href = '/login';
    } catch (err) {
      setError('Failed to delete account');
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <Typography variant="h4" className="profile-title">
          Mon Profile
        </Typography>
        <Typography variant="subtitle1" className="profile-subtitle">
          Gérer vos informations personnelles
        </Typography>
      </div>

      {(error || success) && (
  <Alert severity={error ? "error" : "success"} className="alert-message">
    {error || success}
  </Alert>
)}


      <Card className="profile-card">
        <CardContent>
          <div className="profile-avatar-section">
            <Avatar className="profile-avatar">
              {profile.fullname?.[0]}
            </Avatar>
            <div className="profile-avatar-info">
              <Typography variant="h6">
                {profile.fullname}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {profile.email}
              </Typography>
            </div>
          </div>

          <Divider className="section-divider" />

          <form onSubmit={handleProfileUpdate} className="profile-form">
            <div className="form-fields">
              <TextField
                fullWidth
                label="Nom Complet"
                value={profile.fullname || ''}
                onChange={(e) => setProfile({ ...profile, fullname: e.target.value })}
              />
              <TextField
                fullWidth
                label="Email"
                value={profile.email || ''}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              />
              <TextField
                fullWidth
                label="Nom d'utilisateur"
                value={profile.username || ''}
                onChange={(e) => setProfile({ ...profile, username: e.target.value })}
              />
            </div>

            <div className="button-group">
              {!isEditMode ? (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Person />}
                  onClick={() => setIsEditMode(true)}
                >
                  Modifier Profile
                </Button>
              ) : (
                <>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    Sauvegarder
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => setIsEditMode(false)}
                  >
                    Annuler
                  </Button>
                </>
              )}
            </div>
          </form>

          <Divider className="section-divider" />

          <div className="security-section">
            <Button
              variant="outlined"
              startIcon={<Lock />}
              onClick={() => setIsChangePasswordOpen(true)}
            >
              Changer le mot de passe
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Change Password Dialog */}
      <Dialog 
        open={isChangePasswordOpen} 
        onClose={() => setIsChangePasswordOpen(false)}
        className="dialog-container"
      >
        <DialogTitle>Changer le mot de passe</DialogTitle>
        <DialogContent>
  {passwordError && (
    <Alert severity="error" style={{ marginBottom: "15px" }}>
      {passwordError}
    </Alert>
  )}
  <form onSubmit={handlePasswordChange} className="password-form">
    <TextField
      fullWidth
      type="password"
      label="Mot de passe actuel"
      value={passwordData.currentPassword}
      onChange={(e) =>
        setPasswordData({ ...passwordData, currentPassword: e.target.value })
      }
      margin="normal"
    />
    <TextField
      fullWidth
      type="password"
      label="Nouveau mot de passe"
      value={passwordData.newPassword}
      onChange={(e) =>
        setPasswordData({ ...passwordData, newPassword: e.target.value })
      }
      margin="normal"
    />
    <TextField
      fullWidth
      type="password"
      label="Confirmer le nouveau mot de passe"
      value={passwordData.confirmPassword}
      onChange={(e) =>
        setPasswordData({ ...passwordData, confirmPassword: e.target.value })
      }
      margin="normal"
    />
  </form>
</DialogContent>

        <DialogActions>
          <Button onClick={() => setIsChangePasswordOpen(false)}>
            Annuler
          </Button>
          <Button onClick={handlePasswordChange} variant="contained" color="primary">
            Changer
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Profile;