import React, { useState, useEffect, useCallback, useContext } from 'react';
import { ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { SessionContext } from '../../contexts/SessionContext';
import {
  Typography,
  TextField,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Divider
} from '@mui/material';
import './SurveillanceSchedule.css';
import axios from 'axios';

const SurveillanceSchedule = () => {
    const { selectedSessionId } = useContext(SessionContext);
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [teachers, setTeachers] = useState([]);
    const [timeSlots, setTimeSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCell, setSelectedCell] = useState(null);
    const [surveillanceMenuAnchor, setSurveillanceMenuAnchor] = useState(null);
    const [surveillances, setSurveillances] = useState([]);
    const [availableExams, setAvailableExams] = useState([]);
    const [selectedExam, setSelectedExam] = useState(null);
    const [sessionDates, setSessionDates] = useState({
        startDate: null,
        endDate: null,
        currentStartDate: null
    });

    const SURVEILLANCE_TYPES = {
        RESERVISTE: 'RR',
        NO_SURVEILLANCE: 'NO',
        TOURNANT: 'TT',
        BACKUP: 'B'
    };

    // Fonction pour obtenir un type de surveillance aléatoire
    const getRandomSurveillanceType = () => {
      const types = ['TT', 'RR', 'B', 'NO', '', '','','','','','']; // Ajout de chaînes vides pour augmenter la probabilité de cellules vides
      const randomIndex = Math.floor(Math.random() * types.length);
      return types[randomIndex];
  };

    const fetchTimeSlots = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/timeslots/session/${selectedSessionId}`);
            if (!response.ok) throw new Error('Failed to fetch time slots');
            const data = await response.json();
            
            const sortedTimeSlots = data.sort((a, b) => {
                if (a.period === b.period) {
                    return a.startTime.localeCompare(b.startTime);
                }
                return a.period === 'MORNING' ? -1 : 1;
            });
            
            setTimeSlots(sortedTimeSlots);
        } catch (err) {
            throw new Error('Error fetching time slots: ' + err.message);
        }
    };

    const getFormattedTime = (time) => {
        return time.substring(0, 5);
    };

    const getPeriodLabel = (period) => {
        return period === 'MORNING' ? 'Matin' : 'Après-midi';
    };

    const groupedTimeSlots = timeSlots.reduce((acc, slot) => {
        if (!acc[slot.period]) {
            acc[slot.period] = [];
        }
        acc[slot.period].push(slot);
        return acc;
    }, {});

    useEffect(() => {
        if (selectedSessionId) {
            fetchSessionDates();
            fetchTimeSlots();
        }
    }, [selectedSessionId]);

    useEffect(() => {
        fetchDepartments();
    }, []);

    useEffect(() => {
        if (selectedDepartment) {
            fetchTeachers(selectedDepartment);
        }
    }, [selectedDepartment]);

    const fetchSessionDates = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/sessions/${selectedSessionId}`);
            if (!response.ok) throw new Error('Failed to fetch session dates');
            const sessionData = await response.json();
            
            const startDate = new Date(sessionData.dateDebut);
            const endDate = new Date(sessionData.dateFin);
            
            setSessionDates({
                startDate,
                endDate,
                currentStartDate: startDate
            });
        } catch (err) {
            setError('Error fetching session dates: ' + err.message);
        }
    };

    const getDisplayDates = () => {
        if (!sessionDates.currentStartDate) return [];
        
        const dates = [];
        let currentDate = new Date(sessionDates.currentStartDate);
        
        for (let i = 0; i < 3; i++) {
            if (currentDate <= sessionDates.endDate) {
                dates.push(new Date(currentDate));
                currentDate.setDate(currentDate.getDate() + 1);
            }
        }
        return dates;
    };

    const getDateRangeDisplay = () => {
        if (!sessionDates.currentStartDate) return '';
        
        const startDate = new Date(sessionDates.currentStartDate);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 2);
        
        const formatter = new Intl.DateTimeFormat('fr-FR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
        
        const start = formatter.format(startDate);
        const end = formatter.format(endDate);
        return `${start.split(' ')[0]}-${end.split(' ')[0]} ${end.split(' ')[1]} ${end.split(' ')[2]}`;
    };

    const navigateDates = (direction) => {
        if (!sessionDates.currentStartDate) return;
        
        const newDate = new Date(sessionDates.currentStartDate);
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 3 : -3));
        
        if (newDate >= sessionDates.startDate && newDate <= sessionDates.endDate) {
            setSessionDates((prev) => ({
                ...prev,
                currentStartDate: newDate
            }));
        }
    };

    const fetchDepartments = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:8080/api/departments');
            if (!response.ok) {
                throw new Error('Failed to fetch departments');
            }
            const data = await response.json();
            setDepartments(data);
            if (data.length > 0) {
                setSelectedDepartment(data[0].id.toString());
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchTeachers = async (departmentId) => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:8080/api/departments/${departmentId}/teachers`);
            if (!response.ok) throw new Error('Failed to fetch teachers');
            const data = await response.json();
            setTeachers(data);
        } catch (err) {
            setError('Error fetching teachers: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDepartmentChange = (e) => {
        setSelectedDepartment(e.target.value);
    };

    const formatDate = (date) => new Date(date).toLocaleDateString('fr-FR', { 
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });

    if (loading) {
        return <div className="loading-state">Loading schedule data...</div>;
    }

    if (error) {
        return <div className="error-state">Error: {error}</div>;
    }

    return (
        <div className="surveillance-wrapper">
            <div className="control-panel">
                <select
                    value={selectedDepartment}
                    onChange={handleDepartmentChange}
                    className="department-selector"
                >
                    <option value="">Sélectionner un département</option>
                    {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                            {dept.name}
                        </option>
                    ))}
                </select>

                <div className="date-navigation">
                    <button
                        onClick={() => navigateDates('prev')}
                        disabled={!sessionDates.currentStartDate || 
                                 sessionDates.currentStartDate <= sessionDates.startDate}
                        className="nav-btn"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <span className="current-date-range">{getDateRangeDisplay()}</span>
                    <button
                        onClick={() => navigateDates('next')}
                        disabled={!sessionDates.currentStartDate || 
                                 new Date(sessionDates.currentStartDate)
                                 .setDate(sessionDates.currentStartDate.getDate() + 2) >= 
                                 sessionDates.endDate}
                        className="nav-btn"
                    >
                        <ChevronRight size={20} />
                    </button>
                    <button className="download-btn">
                        <Download size={20} />
                    </button>
                </div>
            </div>

            <div className="schedule-container">
                <table className="schedule-table">
                    <thead>
                        <tr className="column-headers">
                            <th className="teacher-header">Enseignants</th>
                            {getDisplayDates().map(date => (
                                <React.Fragment key={date.toISOString()}>
                                    <th colSpan={2} className="date-header">
                                        {formatDate(date)}
                                    </th>
                                </React.Fragment>
                            ))}
                        </tr>
                        <tr className="period-headers">
                            <th></th>
                            {getDisplayDates().map(date => (
                                <React.Fragment key={date.toISOString()}>
                                    <th className="period-cell">Matin</th>
                                    <th className="period-cell">Après-midi</th>
                                </React.Fragment>
                            ))}
                        </tr>
                        <tr className="time-headers">
                            <th></th>
                            {getDisplayDates().map(date => (
                                timeSlots.map(slot => (
                                    <th key={`${date}-${slot.id}`} className="time-cell">
                                        {getFormattedTime(slot.startTime)} - {getFormattedTime(slot.endTime)}
                                    </th>
                                ))
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {teachers.map(teacher => (
                            <tr key={teacher.id} className="teacher-row">
                                <td className="teacher-name">{teacher.nom} {teacher.prenom}</td>
                                {getDisplayDates().map(date => 
                                    timeSlots.map(slot => (
                                        <td 
                                            key={`${date}-${slot.id}-${teacher.id}`} 
                                            className="schedule-cell"
                                        >
                                            <span className={`surveillance-indicator`}>
                                                {getRandomSurveillanceType()}
                                            </span>
                                        </td>
                                    ))
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SurveillanceSchedule;