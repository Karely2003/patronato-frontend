import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from "../assets/logo.png.jpg";

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');   
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Por favor, complete todos los campos');
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
       
        const msg =
          data.errors?.email?.msg ||
          data.errors?.password?.msg ||
          data.message ||
          'Error al iniciar sesión';
        setErrorMsg(msg);
        return;
      }

     
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify(data.user || {}));
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setErrorMsg('No se pudo conectar con el servidor');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: '450px' }}>
        <div className="auth-header text-center">
          <div className="auth-logo mb-3 mx-auto">
            <img
              src={logo}
              alt="Logo Robles de la Laguna"
              className="rounded-circle"
              style={{
                width: "120px",
                height: "120px",
                objectFit: "cover",
                border: "4px solid white",
                boxShadow: "0 4px 8px #082e0c1a",
              }}
            />
          </div>
          <h4 className="mb-1 fw-bold" style={{color: '#333' } }>ROBLES DE LA LAGUNA</h4>
          <p className="mb-0 text-muted">Gestión de venta de Propiedades</p>
        </div>

        <div className="auth-body">
          <h5 className="card-title text-center mb-4 fw-semibold">
            INICIA SESIÓN PARA CONTINUAR
          </h5>

          
          {errorMsg && (
            <div className="alert alert-danger text-center py-2">{errorMsg}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-semibold">
                <i className="bi bi-envelope me-2"></i>CORREO ELECTRÓNICO
              </label>
              <input
                type="email"
                className="form-control form-control-lg"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hola@gmail.com"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="form-label fw-semibold">
                <i className="bi bi-lock me-2"></i>CONTRASEÑA
              </label>
              <input
                type="password"
                className="form-control form-control-lg"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="******"
                required
              />
            </div>

            <button
              type="submit"
              className="btn  btn-lg w-100 mb-3 fw-semibold" style={{ backgroundColor: '#84c684ff', color: '#fff', borderColor: '#5cd65c' }}
            >
              <i className="bi bi-box-arrow-in-right me-2"></i>Ingresar
            </button>


            <div className="text-center">
              <small className="text-muted">
                ¿No tienes cuenta?{' '}
                <Link
                  to="/register"
                  className="text-primary text-decoration-none fw-semibold"
                >
                  Regístrate aquí
                </Link>.
              </small>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
