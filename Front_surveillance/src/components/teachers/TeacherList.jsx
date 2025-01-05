import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import {
  Typography,
  TextField,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Checkbox
} from '@mui/material';
import { 
  Add, 
  MoreVert, 
  Search,
  School,
  ChevronRight
} from '@mui/icons-material';
import axios from 'axios';
import TeacherDialog from './TeacherDialog';
import TeacherImportDialog from './TeacherImportDialog';
import './TeacherList.css';

const TeacherList = () => {
  const [teachers, setTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const location = useLocation();
  const { departmentId } = useParams();
  const departmentName = location.state?.departmentName;

  useEffect(() => {
    if (departmentId) {
      fetchTeachersByDepartment();
    } else {
      fetchAllTeachers();
    }
  }, [departmentId]);

  const fetchTeachersByDepartment = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/departments/${departmentId}/teachers`);
      setTeachers(response.data);
    } catch (error) {
      console.error('Error fetching teachers:', error);
      setTeachers([]);
    }
  };

  const fetchAllTeachers = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/teachers');
      setTeachers(response.data);
    } catch (error) {
      console.error('Error fetching teachers:', error);
      setTeachers([]);
    }
  };

  const handleOpenImportDialog = () => {
    setIsImportDialogOpen(true);
  };

  const handleCloseImportDialog = () => {
    setIsImportDialogOpen(false);
  };

  const handleOpenDialog = (teacher = null) => {
    setSelectedTeacher(teacher);
    setIsDialogOpen(true);
    setAnchorEl(null);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedTeacher(null);
  };

  const handleDelete = async (teacherId) => {
    try {
      await axios.delete(`http://localhost:8080/api/teachers/${teacherId}`);
      if (departmentId) {
        fetchTeachersByDepartment();
      } else {
        fetchAllTeachers();
      }
      setAnchorEl(null);
    } catch (error) {
      console.error('Error deleting teacher:', error);
    }
  };

  const handleMenuOpen = (event, teacher) => {
    setAnchorEl(event.currentTarget);
    setSelectedTeacher(teacher);
  };

  const filteredTeachers = teachers.filter(teacher =>
    teacher.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.prenom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="teacherContainer">
      <div className="header">
        <div className="navigationPath">
          <School sx={{ fontSize: 18 }} />
          {departmentName ? (
            <>
              <span>Départements</span>
              <ChevronRight sx={{ fontSize: 18 }} />
              <span>{departmentName}</span>
            </>
          ) : (
            <span>Enseignants</span>
          )}
        </div>
        
        <div className="titleArea">
          <div className="titleContent">
            <h1>{departmentName ? `Département ${departmentName}` : 'Enseignants'}</h1>
            <p>Gérer les enseignants {departmentName ? `du département ${departmentName}` : ''}</p>
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
              Ajouter un enseignant
            </Button>
          </div>
        </div>
      </div>

      <div className="searchContainer">
        <TextField
          fullWidth
          placeholder="Rechercher un enseignant..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="searchField"
          InputProps={{
            startAdornment: <Search sx={{ color: '#94a3b8', mr: 1 }} />
          }}
        />
      </div>

      <div className="teacherListContainer">
        <div className="tableHeader">
          <div>Nom</div>
          <div>Prénom</div>
          <div>Email</div>
          <div>Dispensé</div>
          <div>Actions</div>
        </div>

        <div className="teacherRows">
          {filteredTeachers.length === 0 ? (
            <div className="emptyState">
              <h3>Aucun enseignant trouvé</h3>
              <p>Commencez par ajouter un nouvel enseignant</p>
            </div>
          ) : (
            filteredTeachers.map((teacher) => (
              <div key={teacher.id} className="teacherRow">
                <div className="teacherName">{teacher.nom}</div>
                <div className="teacherFirstName">{teacher.prenom}</div>
                <div className="teacherEmail">{teacher.email}</div>
                <div className="teacherDispense">
                  <Checkbox 
                    checked={teacher.dispense} 
                    disabled 
                    className="dispenseCheckbox"
                  />
                </div>
                <div className="teacherActions">
                  <IconButton 
                    onClick={(e) => handleMenuOpen(e, teacher)}
                    className="actionButton"
                  >
                    <MoreVert />
                  </IconButton>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        classes={{
          paper: 'menuPaper'
        }}
      >
        <MenuItem 
          onClick={() => handleOpenDialog(selectedTeacher)}
          className="menuItem"
        >
          Modifier
        </MenuItem>
        <MenuItem 
          onClick={() => handleDelete(selectedTeacher?.id)}
          className="menuItem deleteMenuItem"
        >
          Supprimer
        </MenuItem>
      </Menu>

      <TeacherDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        teacher={selectedTeacher}
        departmentId={departmentId}
        onSave={departmentId ? fetchTeachersByDepartment : fetchAllTeachers}
      />
      <TeacherImportDialog
        open={isImportDialogOpen}
        onClose={handleCloseImportDialog}
        onImportSuccess={departmentId ? fetchTeachersByDepartment : fetchAllTeachers}
      />
    </div>
  );
};

export default TeacherList;