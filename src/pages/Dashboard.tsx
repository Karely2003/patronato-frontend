import React from 'react';

interface DashboardProps {
  toggleSidebar: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ toggleSidebar }) => {
  return (
    <div className="main-content">
      
      <div className="dashboard-header d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="dashboard-title">Dashboard</h2>
          <p className="dashboard-subtitle">Panel principal del sistema</p>
        </div>
        <button className="sidebar-toggle d-lg-none btn btn-outline-primary" onClick={toggleSidebar}>
          <i className="bi bi-list"></i>
        </button>
      </div>

      <div className="dashboard-content">
        
        <div className="row">
          <div className="col-12">
            <div className="card welcome-card">
              <div className="card-body text-center py-5">
                <div className="welcome-message">
                  <i className="bi bi-house-fill welcome-icon"></i>
                  <h3 className="welcome-title">Bienvenido al Sistema</h3>
                  <p className="welcome-text">
                    Sistema de Gestión de Propiedades - ROBLES DE LA LAGUNA
                  </p>
                  <p className="welcome-subtext">
                    Utiliza el menú lateral para acceder a las diferentes secciones del sistema.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;