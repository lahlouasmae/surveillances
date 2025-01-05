import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { SessionContext } from '../../contexts/SessionContext';
import { 
  Box, 
  Button, 
  Typography, 
  TextField, 
  IconButton 
} from '@mui/material';
import { 
  Add, 
  Delete, 
  Edit, 
  CheckCircle 
} from '@mui/icons-material';
import SessionModal from './SessionModal';
import { format } from 'date-fns';
import axios from 'axios';
import './Sessions.css'; 
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';


const Sessions = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingSession, setEditingSession] = useState(null);
  const { setSelectedSessionId } = useContext(SessionContext);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/api/sessions');
      console.log('API Response:', response.data);
      setSessions(response.data);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      setError('Failed to fetch sessions');
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (sessionId) => {
    try {
      await axios.delete(`http://localhost:8080/api/sessions/${sessionId}`);
      fetchSessions(); // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  };

  const getTimeSlotDisplay = (timeSlots) => {
    if (!timeSlots || timeSlots.length === 0) return 'No time slots';
    return timeSlots.map(slot => 
      `${slot.period}: ${slot.startTime}-${slot.endTime}`
    ).join(', ');
  };


  const handleTypeClick = (session) => {
    setSelectedSessionId(session.id);
    navigate('/dashboard', {
      state: { sessionId: session.id }
    });
  };


  return (
    <div className="sessionsContainer">
      <div className="sessionsHeader">
        <div className="headerContent">
          <h1 className="pageTitle">
            Sessions
            <span className="sessionCount">{sessions.length}</span>
          </h1>
          <button
            className="addButton"
            onClick={() => setIsModalOpen(true)}
          >
            <Add /> Ajouter une nouvelle session
          </button>
        </div>
        <input
          type="text"
          className="searchField"
          placeholder="Rechercher une session..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="tableHeader">
        <div>Type</div>
        <div>Date de Debut</div>
        <div>Date de Fin</div>
        <div>Time Slots</div>
        <div>Actions</div>
      </div>

      {sessions.length === 0 ? (
        <div className="emptyState">
          Aucune session trouvée
        </div>
      ) : (
        <div className="sessionsList">
          {sessions.map((session) => (
            <div key={session.id} className="sessionCard">
              <div className="sessionRow">
                <div 
                  className="sessionType"
                  onClick={() => handleTypeClick(session)}
                >
                  {session.type}
                </div>
                <div className="dateText">
                  {format(new Date(session.dateDebut), 'dd/MM/yyyy')}
                </div>
                <div className="dateText">
                  {format(new Date(session.dateFin), 'dd/MM/yyyy')}
                </div>
                <div className="timeSlots">
                  {session.timeSlots?.map(slot => 
                    `${slot.period}: ${slot.startTime}-${slot.endTime}`
                  ).join(', ')}
                </div>
                <div className="actionButtons">
                  <button 
                    className="iconButton editButton"
                    onClick={() => setEditingSession(session)}
                  >
                    <Edit />
                  </button>
                  <button 
                    className="iconButton deleteButton"
                    onClick={() => handleDelete(session.id)}
                  >
                    <Delete />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <SessionModal 
        open={isModalOpen || !!editingSession}
        onClose={() => {
          setIsModalOpen(false);
          setEditingSession(null);
        }}
        onSave={fetchSessions}
        session={editingSession}
      />
    </div>
  );
};

export default Sessions;