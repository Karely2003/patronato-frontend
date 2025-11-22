import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  const navigate = useNavigate();

  const [objData, setObjData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  // Validaciones locales
  const validations = (field: string, value: string) => {
    let errorMsg = '';

    if (field === 'name') {
      if (value.trim().split(' ').length < 2) {
        errorMsg = 'Debes ingresar tu nombre completo (nombre y apellido)';
      }
    }
    if (field === 'email') {
      const emailValid = /\S+@\S+\.\S+/.test(value);
      if (!emailValid) errorMsg = 'Debes ingresar un email válido';
    }
    if (field === 'password') {
      if (value.length < 8 || !/[A-Z]/.test(value)) {
        errorMsg = 'La contraseña debe tener al menos 8 caracteres y una mayúscula';
      }
    }
    if (field === 'confirmPassword') {
      if (value !== objData.password) {
        errorMsg = 'Las contraseñas no coinciden';
      }
    }

    setErrors((prev) => ({ ...prev, [field]: errorMsg }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setObjData((prev) => ({ ...prev, [name]: value }));
    validations(name, value);
  };

  const isFormValid = (): boolean =>
    objData.name.trim().split(' ').length >= 2 &&
    /\S+@\S+\.\S+/.test(objData.email) &&
    objData.password.length >= 8 &&
    /[A-Z]/.test(objData.password) &&
    objData.password === objData.confirmPassword &&
    Object.values(errors).every((msg) => msg === '');

  // Envío al backend
  const sendData = async () => {
    try {
      const res = await fetch('https://backend-production-e10c.up.railway.app/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(objData),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 400 && Array.isArray(data.errors)) {
          const serverErrors: Record<string, string> = {};
          data.errors.forEach((err: { path: string; msg: string }) => {
            serverErrors[err.path] = err.msg;
          });
          setErrors(serverErrors);
        }
        throw new Error('Error en el registro');
      }

      setSuccessMessage('¡Registro exitoso!');
      setTimeout(() => setSuccessMessage(''), 4000);
      setObjData({ name: '', email: '', password: '', confirmPassword: '' });
      setErrors({});
      navigate('/login');
    } catch (err) {
      console.error('Error al enviar los datos', err);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid()) sendData();
  };

  return (
    <div
      className="auth-container"
      style={{
        backgroundColor: '#28a745',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '1rem',
      }}
    >
      <div
        className="auth-card"
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '2rem',
          maxWidth: '400px',
          width: '100%',
          boxShadow: '0 0 15px #f3eded33',
        }}
      >
        <div className="auth-header text-center mb-4">
          <h4
            className="mb-1"
            style={{ fontSize: '2rem', fontWeight: '700', color: '#28a745' }}
          >
            ROBLES DE LA LAGUNA
          </h4>
          <p
            className="mb-0"
            style={{ fontSize: '1rem', fontWeight: '500', color: '#333' }}
          >
            Gestión de venta de Propiedades
          </p>
        </div>

        <h5
          className="text-center mb-4"
          style={{ fontSize: '1.2rem', fontWeight: '600', color: '#28a745' }}
        >
          Crea una cuenta nueva
        </h5>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label" style={{ fontWeight: 600 }}>
              NOMBRE
            </label>
            <input
              type="text"
              className={`form-control form-control-lg ${
                errors.name ? 'is-invalid' : ''
              }`}
              id="name"
              name="name"
              value={objData.name}
              onChange={handleChange}
              placeholder="Ingrese su nombre completo"
            />
            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label" style={{ fontWeight: 600 }}>
              CORREO ELECTRÓNICO
            </label>
            <input
              type="email"
              className={`form-control form-control-lg ${
                errors.email ? 'is-invalid' : ''
              }`}
              id="email"
              name="email"
              value={objData.email}
              onChange={handleChange}
              placeholder="karen123@correo.com"
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label" style={{ fontWeight: 600 }}>
              CONTRASEÑA
            </label>
            <input
              type="password"
              className={`form-control form-control-lg ${
                errors.password ? 'is-invalid' : ''
              }`}
              id="password"
              name="password"
              value={objData.password}
              onChange={handleChange}
              placeholder="******"
            />
            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
          </div>

          <div className="mb-4">
            <label
              htmlFor="confirmPassword"
              className="form-label"
              style={{ fontWeight: 600 }}
            >
              CONFIRMAR CONTRASEÑA
            </label>
            <input
              type="password"
              className={`form-control form-control-lg ${
                errors.confirmPassword ? 'is-invalid' : ''
              }`}
              id="confirmPassword"
              name="confirmPassword"
              value={objData.confirmPassword}
              onChange={handleChange}
              placeholder="******"
            />
            {errors.confirmPassword && (
              <div className="invalid-feedback">{errors.confirmPassword}</div>
            )}
          </div>

          <button
            type="submit"
            className="btn  btn-lg w-100 mb-3 fw-semibold"
            style={{ fontWeight: 600 , backgroundColor: '#84c684ff',color: '#fff', borderColor: '#5cd65c'}}
            disabled={!isFormValid()}
          >
            Crear Cuenta
          </button>
        </form>

        <div className="text-center">
          <small style={{ fontWeight: 500, color: 'rgba(16,15,15,1)' }}>
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" style={{ color: '#28a745' }}>
              Inicia sesión aquí
            </Link>.
          </small>
        </div>
      </div>
    </div>
  );
};

export default Register;
