import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  Select,
  MenuItem,
  Box,
  Typography,
  IconButton,
  TextField
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import dayjs from 'dayjs';
import axios from 'axios';
import './SessionModal.css';

const SessionModal = ({ open, onClose, onSave, session }) => {
  const [type, setType] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);

  const sessionTypes = [
    { value: 'NORMALE_HIVER', label: 'Normale d\'hiver' },
    { value: 'NORMALE_PRINTEMPS', label: 'Normale de printemps' },
    { value: 'RATTRAPAGE_HIVER', label: 'Rattrapage d\'hiver' },
    { value: 'RATTRAPAGE_PRINTEMPS', label: 'Rattrapage de printemps' }
  ];
    // Initialize form when editing a session
  useEffect(() => {
    if (session) {
      setType(session.type);
      setStartDate(dayjs(session.dateDebut));
      setEndDate(dayjs(session.dateFin));
      setTimeSlots(session.timeSlots.map(slot => ({
        period: slot.period,
        startTime: dayjs(slot.startTime, 'HH:mm:ss'),
        endTime: dayjs(slot.endTime, 'HH:mm:ss')
      })));
    } else {
      // Reset form for new session
      setType('');
      setStartDate(null);
      setEndDate(null);
      setTimeSlots([]);
    }
  }, [session]);

  const addTimeSlot = () => {
    setTimeSlots([...timeSlots, {
      period: 'MORNING',
      startTime: null,
      endTime: null
    }]);
  };

  const removeTimeSlot = (index) => {
    setTimeSlots(timeSlots.filter((_, i) => i !== index));
  };

  const updateTimeSlot = (index, field, value) => {
    const updatedSlots = [...timeSlots];
    updatedSlots[index] = {
      ...updatedSlots[index],
      [field]: value
    };
    setTimeSlots(updatedSlots);
  };

  const handleSubmit = async () => {
    try {
      const formattedTimeSlots = timeSlots.map(slot => ({
        period: slot.period,
        startTime: dayjs(slot.startTime).format('HH:mm:ss'),
        endTime: dayjs(slot.endTime).format('HH:mm:ss')
      }));

      const sessionData = {
        type: type,
        dateDebut: dayjs(startDate).format('YYYY-MM-DDTHH:mm:ss'),
        dateFin: dayjs(endDate).format('YYYY-MM-DDTHH:mm:ss'),
        timeSlots: formattedTimeSlots
      };

      if (session) {
        // Update existing session
        await axios.put(`http://localhost:8080/api/sessions/${session.id}`, sessionData);
      } else {
        // Create new session
        await axios.post('http://localhost:8080/api/sessions', sessionData);
      }

      console.log('Sending data:', sessionData);
      onSave();
      onClose();
    } catch (error) {
      console.error('Error creating session:', error);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      className="session-modal"
    >
      <DialogTitle className="modal-title">
        {session ? 'Modifier Session' : 'Ajouter Session'}
      </DialogTitle>
      <DialogContent className="modal-content">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
          <FormControl fullWidth className="form-control">
            <Select
              value={type}
              onChange={(e) => setType(e.target.value)}
              displayEmpty
              className="select-type"
              renderValue={type !== '' ? undefined : () => 'Sélectionner le type de session'}
            >
              {sessionTypes.map((sessionType) => (
                <MenuItem key={sessionType.value} value={sessionType.value}>
                  {sessionType.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <DatePicker
                label="Date de début"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
              <DatePicker
                label="Date de fin"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                minDate={startDate}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Box>

            <Box sx={{ mt: 3 }} className="time-slots-container">
              <Box className="time-slots-header">
                <Typography variant="h6">Créneaux horaires</Typography>
                <Button 
                  startIcon={<AddIcon />}
                  onClick={addTimeSlot}
                  className="add-slot-button"
                >
                  Ajouter un créneau
                </Button>
              </Box>

              {timeSlots.map((slot, index) => (
                <Box 
                  key={index}
                  className="time-slot-row"
                >
                  <FormControl className="period-select">
                    <Select
                      value={slot.period}
                      onChange={(e) => updateTimeSlot(index, 'period', e.target.value)}
                    >
                      <MenuItem value="MORNING">Matin</MenuItem>
                      <MenuItem value="AFTERNOON">Après-midi</MenuItem>
                    </Select>
                  </FormControl>

                  <TimePicker
                    label="Heure début"
                    value={slot.startTime}
                    onChange={(newValue) => updateTimeSlot(index, 'startTime', newValue)}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />

                  <TimePicker
                    label="Heure fin"
                    value={slot.endTime}
                    onChange={(newValue) => updateTimeSlot(index, 'endTime', newValue)}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />

                  <IconButton 
                    onClick={() => removeTimeSlot(index)}
                    color="error"
                    className="delete-button"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </LocalizationProvider>
        </Box>
      </DialogContent>
      <DialogActions className="modal-actions">
        <Button onClick={onClose} className="cancel-button">
          Annuler
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          disabled={!type || !startDate || !endDate || timeSlots.length === 0 || 
                   timeSlots.some(slot => !slot.startTime || !slot.endTime)}
          className="submit-button"
        >
          {session ? 'Modifier' : 'Créer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SessionModal;