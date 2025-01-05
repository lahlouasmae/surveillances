import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  IconButton
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';
import ExamDialog from './ExamDialog';

const ExamListDialog = ({ open, onClose, selectedDate, selectedTimeSlot, currentSession }) => {
  const [exams, setExams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const fetchExams = async () => {
    if (!selectedTimeSlot?.id || !selectedDate) {
      setError('Invalid date or time slot');
      return;
    }
  
    setIsLoading(true);
    setError(null);
  
    try {
      const date = new Date(selectedDate);
      const formattedDate = date.toLocaleDateString('en-CA');
      
      const response = await axios.get(
        `http://localhost:8080/api/exams/date/${formattedDate}/timeslot/${selectedTimeSlot.id}`
      );
  
      setExams(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      setError('Unable to load exams. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (open && selectedTimeSlot?.id && selectedDate) {
      fetchExams();
    }
  }, [open, selectedTimeSlot?.id, selectedDate]);

  const handleEditExam = (exam) => {
    setSelectedExam(exam);
    setIsEditing(true);
    setShowAddDialog(true);
  };

  const handleDeleteExam = async (examId) => {
    if (window.confirm('Are you sure you want to delete this exam?')) {
      setIsLoading(true);
      try {
        await axios.delete(`http://localhost:8080/api/exams/${examId}`);
        await fetchExams();
      } catch (error) {
        setError('Failed to delete exam. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleExamUpdate = () => {
    fetchExams();
    setShowAddDialog(false);
    setSelectedExam(null);
    setIsEditing(false);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          Exams for {new Date(selectedDate).toLocaleDateString()} - {selectedTimeSlot?.startTime}
        </DialogTitle>
        <DialogContent>
          {isLoading ? (
            <div className="flex justify-center p-4">
              <CircularProgress />
            </div>
          ) : error ? (
            <div className="text-red-500 p-4 bg-red-50 rounded">
              {error}
            </div>
          ) : (
            <div className="space-y-4">
              {exams.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No exams scheduled for this time slot</p>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left py-2">Module</th>
                      <th className="text-left py-2">Department</th>
                      <th className="text-left py-2">Students</th>
                      <th className="text-left py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exams.map(exam => (
                      <tr key={exam.id} className="border-t">
                        <td className="py-2">{exam.module?.name}</td>
                        <td className="py-2">{exam.department?.name}</td>
                        <td className="py-2">{exam.studentCount}</td>
                        <td className="py-2">
                          <IconButton
                            color="primary"
                            onClick={() => handleEditExam(exam)}
                            disabled={isLoading}
                            size="small"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => handleDeleteExam(exam.id)}
                            disabled={isLoading}
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="inherit">
            Close
          </Button>
          <Button 
            onClick={() => {
              setSelectedExam(null);
              setIsEditing(false);
              setShowAddDialog(true);
            }}
            variant="contained" 
            color="primary"
          >
            Add New Exam
          </Button>
        </DialogActions>
      </Dialog>

      <ExamDialog
        open={showAddDialog}
        onClose={() => {
          setShowAddDialog(false);
          setSelectedExam(null);
          setIsEditing(false);
        }}
        selectedDate={selectedDate}
        selectedTimeSlot={selectedTimeSlot}
        currentSession={currentSession}
        onExamUpdate={handleExamUpdate}
        examToEdit={selectedExam}
        isEditing={isEditing}
      />
    </>
  );
};

export default ExamListDialog;