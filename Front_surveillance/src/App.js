// src/App.js
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from "./components/layout/Navbar";
import Login from './components/auth/login';
import Sessions from './components/sessions/Sessions';
import DepartmentList from './components/departments/DepartmentList';
import TeacherList from './components/teachers/TeacherList';
import LocalList from './components/locals/LocalList';
import Dashboard from "./components/layout/Dashboard";
import ModuleList from "./components/modules/ModuleList";
import OptionList from "./components/options/OptionList";
import ExamCalendar from './components/exams/ExamCalendar';
import { SessionProvider } from './contexts/SessionContext';
import SurveillanceSchedule from './components/surveillance/SurveillanceSchedule';
import Profile from './components/auth/Profile';

const NavbarWrapper = ({ isAuthenticated }) => {
  const location = useLocation();
  const hiddenPaths = ['/', '/login', '/sessions'];
  
  const shouldShowNavbar = isAuthenticated && !hiddenPaths.includes(location.pathname);

  return shouldShowNavbar ? <Navbar /> : null;
};

function App() {
  const isAuthenticated = true;
  return (
    <SessionProvider>
      <BrowserRouter>
      <NavbarWrapper isAuthenticated={isAuthenticated} />
      <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sessions" element={<Sessions />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/departments" element={<DepartmentList />} />
          <Route path="teachers" element={<TeacherList />} />
          <Route path="departments/:departmentId/teachers" element={<TeacherList />} />
          <Route path="locals" element={<LocalList />} />
          <Route path="/options/:optionId/modules" element={<ModuleList />} />
          <Route path="options" element={<OptionList />} />
          <Route path="modules" element={<ModuleList />} />
          <Route path="exams" element={<ExamCalendar />} />
          <Route path="surveillance" element={<SurveillanceSchedule />} />
          <Route path="profile" element={<Profile/>}/>

        </Routes>
      </BrowserRouter>
    </SessionProvider>
  );
}

export default App;