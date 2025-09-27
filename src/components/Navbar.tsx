import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/dashboard">
          <i className="bi bi-house-fill me-2"></i>
          ROBLES DE LA LAGUNA
        </Link>
        <button 
          className="navbar-toggler" 
          type="button" 
          onClick={toggleNavbar}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`}>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link 
                className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`} 
                to="/dashboard"
              >
                <i className="bi bi-speedometer2 me-1"></i> Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${location.pathname === '/clients' ? 'active' : ''}`} 
                to="/clients"
              >
                <i className="bi bi-people-fill me-1"></i> Clientes
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${location.pathname === '/appointments' ? 'active' : ''}`} 
                to="/appointments"
              >
                <i className="bi bi-calendar-event me-1"></i> Citas
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${location.pathname === '/payments' ? 'active' : ''}`} 
                to="/payments"
              >
                <i className="bi bi-currency-exchange me-1"></i> Pagos
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${location.pathname === '/reports' ? 'active' : ''}`} 
                to="/reports"
              >
                <i className="bi bi-graph-up me-1"></i> Reportes
              </Link>
            </li>
          </ul>
          <div className="d-flex">
            <Link to="/logout" className="btn btn-outline-light">
              <i className="bi bi-box-arrow-right me-1"></i> Cerrar Sesión
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;