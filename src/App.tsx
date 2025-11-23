import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';
import '@fontsource/poppins';
import './index.css'; 

import Sidebar from './components/Sidebar';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Payments from './pages/Payments';
import Appointments from './pages/Appointments';
import Reports from './pages/Reports';
import Logout from './pages/Logout';

// Componentes wrapper que incluyen el sidebar
const DashboardLayout = ({ isOpen, toggleSidebar }: { isOpen: boolean, toggleSidebar: () => void }) => (
  <div className="d-flex">
    <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
    <Dashboard toggleSidebar={toggleSidebar} />
  </div>
);

const ClientsLayout = ({ isOpen, toggleSidebar }: { isOpen: boolean, toggleSidebar: () => void }) => (
  <div className="d-flex">
    <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
    <Clients toggleSidebar={toggleSidebar} />
  </div>
);

const PaymentsLayout = ({ isOpen, toggleSidebar }: { isOpen: boolean, toggleSidebar: () => void }) => (
  <div className="d-flex">
    <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
    <Payments />
  </div>
);

const AppointmentsLayout = ({ isOpen, toggleSidebar }: { isOpen: boolean, toggleSidebar: () => void }) => (
  <div className="d-flex">
    <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
    <Appointments />
  </div>
);

const ReportsLayout = ({ isOpen, toggleSidebar }: { isOpen: boolean, toggleSidebar: () => void }) => (
  <div className="d-flex">
    <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
    <Reports />
  </div>
);

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <DashboardLayout isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
            </PrivateRoute>
          } />
          <Route path="/clients" element={
            <PrivateRoute>
              <ClientsLayout isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
            </PrivateRoute>
          } />
          <Route path="/payments" element={
            <PrivateRoute>
              <PaymentsLayout isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
            </PrivateRoute>
          } />
          <Route path="/appointments" element={
            <PrivateRoute>
              <AppointmentsLayout isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
            </PrivateRoute>
          } />
          <Route path="/reports" element={
            <PrivateRoute>
              <ReportsLayout isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
            </PrivateRoute>
          } />
          <Route path="/logout" element={<PrivateRoute><Logout /></PrivateRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;