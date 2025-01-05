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
  MenuItem,
  CircularProgress
} from '@mui/material';
import axios from 'axios';
import './ExamDialog.css';

const ExamDialog = ({
  open,
  onClose,
  selectedDate,
  selectedTimeSlot,
  currentSession,
  onExamUpdate,
  examToEdit,
  isEditing: isEditingProp
}) => {
  const initialFormState = {
    department_id: '',
    teacher_id: '',
    option_id: '',
    module_id: '',
    student_count: '',
    local_id: '',
    date_exam: selectedDate || '',
    time_slot_id: selectedTimeSlot?.id || '',
    session_id: currentSession?.id || ''
  };

  const [examForm, setExamForm] = useState(initialFormState);
  const [departments, setDepartments] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [options, setOptions] = useState([]);
  const [modules, setModules] = useState([]);
  const [locals, setLocals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing] = useState(isEditingProp || false);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/exams/exam-form-data');
      setDepartments(response.data.departments || []);
      setLocals(response.data.locals || []);
    } catch (error) {
      console.error('Error fetching initial data:', error);
      setError('Failed to load initial data');
    }
  };

  const fetchTeachersAndOptions = async (departmentId) => {
    if (!departmentId) return;
    
    try {
      const [teachersResponse, optionsResponse] = await Promise.all([
        axios.get(`http://localhost:8080/api/departments/${departmentId}/teachers`),
        axios.get(`http://localhost:8080/api/options/department/${departmentId}`)
      ]);
      setTeachers(teachersResponse.data || []);
      setOptions(optionsResponse.data || []);
    } catch (error) {
      console.error('Error fetching related data:', error);
      setError('Failed to load teachers and options');
    }
  };

  const fetchModules = async (optionId) => {
    if (!optionId) return;
    
    try {
      const response = await axios.get(`http://localhost:8080/api/modules/option/${optionId}`);
      setModules(response.data || []);
    } catch (error) {
      console.error('Error fetching modules:', error);
      setError('Failed to load modules');
    }
  };

  // Initial data fetch on dialog open
  useEffect(() => {
    if (open) {
      setIsLoading(true);
      fetchDepartments().finally(() => setIsLoading(false));
    } else {
      // Reset form when dialog closes
      setExamForm(initialFormState);
    }
  }, [open]);

  // Handle exam editing
  useEffect(() => {
    if (examToEdit && open) {
      setExamForm({
        department_id: examToEdit.department?.id || '',
        teacher_id: examToEdit.teacher?.id || '',
        option_id: examToEdit.option?.id || '',
        module_id: examToEdit.module?.id || '',
        student_count: examToEdit.studentCount || '',
        local_id: examToEdit.local?.id || '',
        date_exam: selectedDate || '',
        time_slot_id: selectedTimeSlot?.id || '',
        session_id: currentSession?.id || ''
      });

      if (examToEdit.department?.id) {
        fetchTeachersAndOptions(examToEdit.department.id);
      }
      if (examToEdit.option?.id) {
        fetchModules(examToEdit.option.id);
      }
    }
  }, [examToEdit, open, selectedDate, selectedTimeSlot?.id, currentSession?.id]);

  const handleInputChange = async (event) => {
    const { name, value } = event.target;
    setExamForm(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'department_id' && value) {
      setExamForm(prev => ({
        ...prev,
        teacher_id: '',
        option_id: '',
        module_id: ''
      }));
      await fetchTeachersAndOptions(value);
    } else if (name === 'option_id' && value) {
      setExamForm(prev => ({
        ...prev,
        module_id: ''
      }));
      await fetchModules(value);
    }
  };

  const handleSubmit = async () => {
    if (!selectedTimeSlot?.startTime || !selectedDate || !currentSession?.id) {
      setError('Missing required time slot or session information');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const dateObj = new Date(selectedDate);
      const [hours, minutes] = selectedTimeSlot.startTime.split(':');
      dateObj.setHours(parseInt(hours, 10));
      dateObj.setMinutes(parseInt(minutes, 10));
      dateObj.setSeconds(0);
      dateObj.setMilliseconds(0);

      const formattedExamForm = {
        ...examForm,
        student_count: Number(examForm.student_count),
        date_exam: dateObj.toISOString().slice(0, 19),
        time_slot_id: selectedTimeSlot.id,
        session_id: currentSession.id
      };

      if (isEditing && examToEdit?.id) {
        await axios.put(
          `http://localhost:8080/api/exams/${examToEdit.id}`,
          formattedExamForm
        );
      } else {
        await axios.post(
          'http://localhost:8080/api/exams',
          formattedExamForm
        );
      }

      onExamUpdate();
      onClose();
    } catch (error) {
      console.error('Error saving exam:', error.response?.data || error.message);
      setError(error.response?.data || 'Failed to save exam');
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    return examForm.department_id &&
           examForm.teacher_id &&
           examForm.option_id &&
           examForm.module_id &&
           examForm.student_count &&
           examForm.local_id;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {isEditing ? 'Edit Exam' : 'Add New Exam'}
      </DialogTitle>
      <DialogContent>
        {isLoading ? (
          <div className="flex justify-center p-4">
            <CircularProgress />
          </div>
        ) : (
          <>
            {error && (
              <div className="text-red-500 p-4 bg-red-50 rounded text-center mb-4">
                {error}
              </div>
            )}
            <div className="flex flex-col gap-5 mt-4">
              <FormControl fullWidth>
                <InputLabel>Department</InputLabel>
                <Select
                  name="department_id"
                  value={examForm.department_id}
                  onChange={handleInputChange}
                  disabled={isLoading}
                >
                  {departments.map(department => (
                    <MenuItem key={department.id} value={department.id}>
                      {department.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Teacher</InputLabel>
                <Select
                  name="teacher_id"
                  value={examForm.teacher_id}
                  onChange={handleInputChange}
                  disabled={!examForm.department_id || isLoading}
                >
                  {teachers.map(teacher => (
                    <MenuItem key={teacher.id} value={teacher.id}>
                      {teacher.nom}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Option</InputLabel>
                <Select
                  name="option_id"
                  value={examForm.option_id}
                  onChange={handleInputChange}
                  disabled={!examForm.department_id || isLoading}
                >
                  {options.map(option => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Module</InputLabel>
                <Select
                  name="module_id"
                  value={examForm.module_id}
                  onChange={handleInputChange}
                  disabled={!examForm.option_id || isLoading}
                >
                  {modules.map(module => (
                    <MenuItem key={module.id} value={module.id}>
                      {module.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Student Count"
                name="student_count"
                type="number"
                value={examForm.student_count}
                onChange={handleInputChange}
                disabled={isLoading}
              />

              <FormControl fullWidth>
                <InputLabel>Local</InputLabel>
                <Select
                  name="local_id"
                  value={examForm.local_id}
                  onChange={handleInputChange}
                  disabled={isLoading}
                >
                  {locals.map(local => (
                    <MenuItem key={local.id} value={local.id}>
                      {local.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
          disabled={isLoading || !validateForm()}
        >
          {isEditing ? 'Update' : 'Add'} Exam
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExamDialog;