import React, { useContext, useState, useEffect } from 'react';
import { Dialog } from '@mui/material';
import axios from 'axios';
import { SessionContext } from '../../contexts/SessionContext';
import ExamDialog from './ExamDialog';
import './ExamCalendar.css';
import ExamListDialog from './ExamListDialog';

const ExamCalendar = ({ sessionId }) => {
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [exams, setExams] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSession, setCurrentSession] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const { selectedSessionId } = useContext(SessionContext);
  const [showExamListDialog, setShowExamListDialog] = useState(false);
  const [selectedCell, setSelectedCell] = useState({
    date: null,
    timeSlot: null
  });

  // Modules statiques avec des clés basées sur les plages horaires
  const staticModules = {
    "2024-01-15": {
      "08:00:00-10:40:00": { name: "Machine Learning Basics", prof: "LAHBABI" },
      "10:55:00-12:20:00": { name: "Network Architecture", prof: "BENABBOU" }
    },
    "2024-01-16": {
      "08:00:00-10:40:00": { name: "Développement Mobile", prof: "ZAKI" },
    }, "2024-01-17": {
      "08:00:00-10:40:00": { name: "quantique	biologique", prof: "HARAT" },
      "10:55:00-12:20:00": { name: "Cybersecurity Fundamentals", prof: "BENABBOU" }

    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [timeSlotsResponse, sessionResponse] = await Promise.all([
          axios.get(`http://localhost:8080/api/timeslots/session/${selectedSessionId}`),
          axios.get(`http://localhost:8080/api/sessions/${selectedSessionId}`)
        ]);

        setTimeSlots(timeSlotsResponse.data);
        setCurrentSession(sessionResponse.data);
        setErrorMessage('');
      } catch (error) {
        console.error('Error fetching initial data:', error);
        setErrorMessage('Failed to load calendar data. Please try again.');
      }
    };

    if (selectedSessionId) {
      fetchInitialData();
    }
  }, [selectedSessionId]);

  const handleCellClick = async (date, timeSlotId) => {
    const timeSlot = timeSlots.find(slot => slot.id === timeSlotId);
    if (!timeSlot) {
      setErrorMessage('Invalid time slot selected');
      return;
    }

    setSelectedCell({
      date,
      timeSlot
    });
    setShowExamListDialog(true);
  };

  const getDatesInRange = () => {
    if (!currentSession?.dateDebut || !currentSession?.dateFin) return [];

    const dates = [];
    let currentDate = new Date(currentSession.dateDebut);
    const endDate = new Date(currentSession.dateFin);

    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  if (!selectedSessionId) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600">Please select a session to view the exam calendar.</p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600">{errorMessage}</p>
      </div>
    );
  }

  const formatTimeSlot = (slot) => `${slot.startTime}-${slot.endTime}`;

  return (
    <div className="calendar-container">
      <div className="calendar-card">
        <div className="calendar-header">
          <h1 className="header-title">
            Exam Calendar
            {currentSession && (
              <span className="session-badge">{currentSession.type}</span>
            )}
          </h1>
          {currentSession && (
            <p className="header-subtitle">
              Session period: {new Date(currentSession.dateDebut).toLocaleDateString()} - 
              {new Date(currentSession.dateFin).toLocaleDateString()}
            </p>
          )}
        </div>

        <div className="calendar-table-container">
          <table className="calendar-table">
            <thead>
              <tr>
                <th>Date</th>
                {timeSlots.map((slot) => (
                  <th key={slot.id}>
                    <div className="time-slot-header">
                      <span className="time-slot-time">{slot.startTime}</span>
                      <span className="time-slot-separator">to</span>
                      <span className="time-slot-time">{slot.endTime}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {getDatesInRange().map((date) => (
                <tr key={date.toISOString()}>
                  <td className="date-cell">
                    {new Date(date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                  {timeSlots.map((slot) => {
                    const dateKey = date.toISOString().split('T')[0];
                    const timeSlotKey = formatTimeSlot(slot);
                    const module = staticModules[dateKey]?.[timeSlotKey];

                    return (
                      <td
                        key={`${date.toISOString()}-${slot.id}`}
                        onClick={() => handleCellClick(date.toISOString(), slot.id)}
                        className="calendar-cell"
                      >
                        {module ? (
                          <div
                            className="module-info"
                            style={{
                              padding: '8px',
                              backgroundColor: '#f0f9ff',
                              borderRadius: '4px'
                            }}
                          >
                            <div
                              style={{
                                fontSize: '14px',
                                fontWeight: 'bold',
                                color: '#1e40af'
                              }}
                            >
                              {module.name}
                            </div>
                            <div style={{ fontSize: '12px', color: '#64748b' }}>
                              Prof: {module.prof}
                            </div>
                          </div>
                        ) : (
                          <span
                            style={{
                              color: '#9ca3af',
                              fontStyle: 'italic',
                              fontSize: '12px'
                            }}
                          >
                            No module
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {errorMessage && (
          <div className="error-message">{errorMessage}</div>
        )}

        {!timeSlots.length && !errorMessage && (
          <div className="loading-state">Loading calendar...</div>
        )}
      </div>

      <ExamDialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedDate={selectedDate}
        selectedTimeSlot={selectedTimeSlot}
        currentSession={currentSession}
        onExamUpdate={() => {
          handleCellClick(selectedDate, selectedTimeSlot?.id);
        }}
      />

      <ExamListDialog
        open={showExamListDialog}
        onClose={() => setShowExamListDialog(false)}
        selectedDate={selectedCell.date}
        selectedTimeSlot={selectedCell.timeSlot}
        currentSession={currentSession}
        onAddExam={() => {
          setShowExamListDialog(false);
          setSelectedDate(selectedCell.date);
          setSelectedTimeSlot(selectedCell.timeSlot);
          setIsModalOpen(true);
        }}
      />
    </div>
  );
};

export default ExamCalendar;
