import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Simulamos el cierre de sesión
    localStorage.removeItem('isAuthenticated');
    
    // Redirigimos al login después de un breve retraso
    const timer = setTimeout(() => {
      navigate('/login');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="container-fluid p-4">
      <div className="row justify-content-center">
        <div className="col-md-6 text-center">
          <div className="card">
            <div className="card-body py-5">
              <div className="mb-4">
                <i className="bi bi-box-arrow-right" style={{ fontSize: '3rem', color: '#0d6efd' }}></i>
              </div>
              <h3>Cerrando sesión...</h3>
              <p>Serás redirigido a la página de inicio de sesión</p>
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Logout;