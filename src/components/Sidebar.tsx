import React from 'react'; 
import { Link, useLocation } from 'react-router-dom';
import logo from "../assets/logo.png.jpg"; // 👈 Importa tu logo aquí

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();

  return (  
    <>
      {/* Overlay para móviles */}
      {isOpen && (
        <div 
          className="sidebar-overlay d-lg-none" 
          onClick={toggleSidebar}
        ></div>
      )}
      
      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header text-center">
          {/* Logo redondo */}
          <div className="sidebar-logo mb-2">
            <img 
              src={logo} 
              alt="Logo Robles de la Laguna" 
              style={{ 
                width: "90px", 
                height: "90px", 
                borderRadius: "50%", 
                objectFit: "cover" 
              }} 
            />
          </div>
          <h4 style={{ fontSize: "1.3rem", fontWeight: "bold" }}>ROBLES DE LA LAGUNA</h4>
          <p className="sidebar-subtitle" style={{ fontSize: "1rem" }}>Gestión de venta de Propiedades</p>
        </div>
        
        <div className="sidebar-menu">
          <Link 
            to="/dashboard" 
            className={`sidebar-item ${location.pathname === '/dashboard' ? 'active' : ''}`}
            onClick={() => window.innerWidth < 992 && toggleSidebar()}
          >
            <i className="bi bi-speedometer2"></i>
            <span style={{ fontSize: "1.1rem" }}>Dashboard</span>
          </Link>
          
          <Link 
            to="/clients" 
            className={`sidebar-item ${location.pathname === '/clients' ? 'active' : ''}`}
            onClick={() => window.innerWidth < 992 && toggleSidebar()}
          >
            <i className="bi bi-people-fill"></i>
            <span style={{ fontSize: "1.1rem" }}>Clientes</span>
          </Link>
          
          <Link 
            to="/appointments" 
            className={`sidebar-item ${location.pathname === '/appointments' ? 'active' : ''}`}
            onClick={() => window.innerWidth < 992 && toggleSidebar()}
          >
            <i className="bi bi-calendar-event"></i>
            <span style={{ fontSize: "1.1rem" }}>Citas</span>
          </Link>
          
          <Link 
            to="/payments" 
            className={`sidebar-item ${location.pathname === '/payments' ? 'active' : ''}`}
            onClick={() => window.innerWidth < 992 && toggleSidebar()}
          >
            <i className="bi bi-currency-exchange"></i>
            <span style={{ fontSize: "1.1rem" }}>Pagos</span>
          </Link>
          
          <Link 
            to="/reports" 
            className={`sidebar-item ${location.pathname === '/reports' ? 'active' : ''}`}
            onClick={() => window.innerWidth < 992 && toggleSidebar()}
          >
            <i className="bi bi-graph-up"></i>
            <span style={{ fontSize: "1.1rem" }}>Reportes</span>
          </Link>
          
          <Link 
            to="/logout" 
            className="sidebar-item"
            onClick={() => window.innerWidth < 992 && toggleSidebar()}
          >
            <i className="bi bi-box-arrow-right"></i>
            <span style={{ fontSize: "1.1rem" }}>Cerrar Sesión</span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
