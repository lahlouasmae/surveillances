import React, { useState, useEffect } from 'react';
import { 
  Description, 
  Person, 
  Business, 
  Visibility 
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const [teacherCount, setTeacherCount] = useState(0);
  const [departmentCount, setDepartmentCount] = useState(0);
  const [examCount, setExamCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      // Fetch teachers count
      const teachersResponse = await axios.get('http://localhost:8080/api/teachers');
      setTeacherCount(teachersResponse.data.length);

      // Fetch departments count
      const departmentsResponse = await axios.get('http://localhost:8080/api/departments');
      setDepartmentCount(departmentsResponse.data.length);

      const examsResponse = await axios.get('http://localhost:8080/api/exams/all');
      setExamCount(examsResponse.data.length);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching counts:', error);
      setLoading(false);
    }
  };

  const stats = [
    {
      title: "Exams",
      value: 11,
      subtitle: "Nombre total d'exams du dernier session",
      icon: <Description />,
    },
    {
      title: "Enseignants",
      value: teacherCount,
      trend: "+19% par rapport au mois dernier",
      subtitle: "Nombre total d'enseignants dans la faculté",
      icon: <Person />,
    },
    {
      title: "Nombre total de départements",
      value: departmentCount,
      subtitle: "le nombre total des departements presents dans la session",
      icon: <Business />,
    },
    {
      title: "Surveillance actuelle",
      value: "0.22",
      subtitle: "Moyenne de surveillance par enseignant dans la dernière session par demi journé",
      icon: <Visibility />,
    }
  ];

  const recentExams = [
    { code: "NA", prof: "LAHBABI", name: "Machine Learning Basics" },
    { code: "NA", prof: "BENABBOU", name: "Network Architecture" },
    { code: "NA", prof: "ZAKI", name: "Développement mobile" },
    { code: "NA", prof: "HARAT", name: "quantique biologique" },
    { code: "NA", prof: "BENABBOU", name: "Cybersecurity Fundamentals" }
  ];

  const chartData = [
    { month: 'Jan', examCount: 45, surveillanceRate: 0.25 },
    { month: 'Fév', examCount: 52, surveillanceRate: 0.28 },
    { month: 'Mar', examCount: 38, surveillanceRate: 0.20 },
    { month: 'Avr', examCount: 48, surveillanceRate: 0.22 },
    { month: 'Mai', examCount: 56, surveillanceRate: 0.30 },
    { month: 'Juin', examCount: 62, surveillanceRate: 0.35 }
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Sessions</h1>
        <p className="subtitle">Gérer les sessions</p>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div className="stat-card" key={index}>
            <div className="stat-header">
              <div className="stat-icon">{stat.icon}</div>
              <h3>{stat.title}</h3>
            </div>
            <div className="stat-value">
              {loading ? 'Loading...' : stat.value}
            </div>
            {stat.trend && <div className="stat-trend">{stat.trend}</div>}
            <div className="stat-subtitle">{stat.subtitle}</div>
          </div>
        ))}
      </div>

      <div className="dashboard-content">
        <div className="chart-section">
          <h2>Aperçu</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Bar yAxisId="left" dataKey="examCount" fill="#4F46E5" name="Examens" />
                <Bar yAxisId="right" dataKey="surveillanceRate" fill="#818CF8" name="Taux de surveillance" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="recent-exams">
          <h2>Exams récentes</h2>
          <p className="section-subtitle">Les cinq dernier exams</p>
          <div className="exams-list">
            {recentExams.map((exam, index) => (
              <div className="exam-item" key={index}>
                <div className="exam-code">{exam.code}</div>
                <div className="exam-prof">{exam.prof}</div>
                <div className="exam-name">{exam.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;