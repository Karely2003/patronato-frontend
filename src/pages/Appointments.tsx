import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

interface Appointment {
  id: number;
  cliente_id: number;
  nombre: string;
  fecha: string;
  hora: string;
  notas: string;
}

interface Client {
  id: number;
  nombre: string;
}

interface AppointmentsProps {
  toggleSidebar?: () => void;
}

const Appointments: React.FC<AppointmentsProps> = ({ toggleSidebar }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [clientes, setClientes] = useState<Client[]>([]);
  const [cliente, setCliente] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [notas, setNotas] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'id' | 'nombre' | 'fecha' | 'hora'>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchAppointments();
    fetchClientes();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await fetch('http://localhost:3001/citas');
      const data = await res.json();
          const simulated = Array.from({ length: 42 }, (_, i) => ({
          ...data.data[i % data.data.length],
          id: i + 1
        }));
      setAppointments(data.data);
    } catch (err) {
      console.error('Error al cargar citas:', err);
    }
  };

  const fetchClientes = async () => {
    try {
     const res = await fetch('https://backend-production-e10c.up.railway.app/clientes');
      const data = await res.json();
      setClientes(data.data);
    } catch (err) {
      console.error('Error al cargar clientes:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cliente || !fecha || !hora) {
      Swal.fire('Error', 'Complete todos los campos obligatorios.', 'error');
      return;
    }

    const payload = {
      nombre: cliente,
      fecha,
      hora,
      notas
    };

    try {
      const url = editingId !== null
        ? `https://backend-production-e10c.up.railway.app/citas/edit/${editingId}`
        : 'https://backend-production-e10c.up.railway.app/citas/register';

      const method = editingId !== null ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Error al guardar cita');

      await fetchAppointments();
      setCliente('');
      setFecha('');
      setHora('');
      setNotas('');
      setEditingId(null);
    } catch (err) {
      console.error('Error al guardar cita:', err);
    }
        Swal.fire({
      icon: 'success',
      title: editingId !== null ? 'Cita actualizada correctamente' : 'Cita registrada correctamente',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true
    });

  };

  const handleEdit = (appointment: Appointment) => {
    setCliente(appointment.nombre);
    setFecha(appointment.fecha);
    setHora(appointment.hora);
    setNotas(appointment.notas);
    setEditingId(appointment.id);
  };

    const handleDelete = async (appointment: Appointment) => {
      const confirm = await Swal.fire({
        title: `¿Desea eliminar la cita de ${appointment.nombre}?`,
        html: `<div class="text-muted">Fecha: ${formatDate(appointment.fecha)}<br>Hora: ${formatTime12h(appointment.hora)}</div>`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar'
      });

      if (confirm.isConfirmed) {
        try {
          const res = await fetch(`http://localhost:3001/citas/delete/${appointment.id}`, {
            method: 'DELETE'
          });

          if (!res.ok) throw new Error('Error al eliminar cita');

          await fetchAppointments();

          // ✅ Alerta automática sin botón OK
          Swal.fire({
            icon: 'success',
            title: 'Cita eliminada correctamente',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true
          });
        } catch (err) {
          console.error('Error al eliminar cita:', err);
        }
      }
    };


// 🔎 Filtro por ID o nombre
const filteredAppointments = appointments.filter(a =>
  (typeof a.nombre === 'string' && a.nombre.toLowerCase().includes(searchTerm.toLowerCase())) ||
  a.id.toString() === searchTerm
);


// 🔀 Ordenamiento
const sortedAppointments = [...filteredAppointments].sort((a, b) => {
  if (sortField === 'id') return sortOrder === 'asc' ? a.id - b.id : b.id - a.id;
  if (sortField === 'nombre') return sortOrder === 'asc' ? a.nombre.localeCompare(b.nombre) : b.nombre.localeCompare(a.nombre);
  if (sortField === 'fecha') return sortOrder === 'asc'
    ? new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
    : new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
  return sortOrder === 'asc' ? a.hora.localeCompare(b.hora) : b.hora.localeCompare(a.hora);
});

// 📄 Paginación
const indexOfLast = currentPage * itemsPerPage;
const indexOfFirst = indexOfLast - itemsPerPage;
const currentAppointments = sortedAppointments.slice(indexOfFirst, indexOfLast);
const totalPages = Math.ceil(sortedAppointments.length / itemsPerPage);


  const toggleSortOrder = (field: 'id' | 'nombre' | 'fecha' | 'hora') => {
    if (sortField === field) setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });

  const formatTime12h = (time24: string) => {
    const [hour, minute] = time24.split(':').map(Number);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minute.toString().padStart(2, '0')} ${ampm}`;
  };


  return (
    <div className="main-content">
  <div className="dashboard-header">
    <button className="sidebar-toggle d-lg-none" onClick={toggleSidebar}>
      <i className="bi bi-list"></i>
    </button>
    <h2 className="fs-2">Gestión de Citas</h2>
  </div>

  <div className="dashboard-content">
    <div className="row justify-content-center">
      <div className="col-12">
        <div className="card mx-auto shadow-lg border-0" style={{ maxWidth: '1400px' }}>
          <div className="card-header bg-primary text-white py-3">
            <h4 className="mb-0 text-center fs-3" style={{ color: 'black' }}>
              <i className="bi bi-calendar-event me-2"></i>
              ROBLES DE LA LAGUNA - Gestión de Citas
            </h4>
          </div>

          <div className="card-body p-4">
            <div className="row g-4">
              {/* Formulario */}
              <div className="col-lg-5 col-md-6">
                <div className="card h-100 shadow-sm">
                  <div className="card-header bg-light text-center">
                    <h5 className="mb-0">
                      <i className={`bi ${editingId !== null ? 'bi-pencil-square' : 'bi-calendar-plus'} me-1`}></i>
                      {editingId !== null ? 'Editar Cita' : 'Programar Nueva Cita'}
                    </h5>
                  </div>
                  <div className="card-body">
                    <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="cliente" className="form-label fw-bold">
                        <i className="bi bi-person me-1"></i>Cliente
                      </label>
                      <input
                        list="clientes"
                        className="form-control"
                        id="cliente"
                        value={cliente}
                        onChange={e => setCliente(e.target.value)}
                        placeholder="Seleccione o escriba el nombre del cliente"
                        required
                      />
                      <datalist id="clientes">
                        {clientes.map(c => (
                          <option key={c.id} value={c.nombre} />
                        ))}
                      </datalist>
                    </div>


                      <div className="mb-3">
                        <label htmlFor="date" className="form-label fw-bold">
                          <i className="bi bi-calendar me-1"></i>Fecha
                        </label>
                        <input
                          type="date"
                          className="form-control form-control-lg"
                          id="date"
                          value={fecha}
                          onChange={e => setFecha(e.target.value)}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label htmlFor="time" className="form-label fw-bold">
                          <i className="bi bi-clock me-1"></i>Hora
                        </label>
                        <input
                          type="time"
                          className="form-control form-control-lg"
                          id="time"
                          value={hora}
                          onChange={e => setHora(e.target.value)}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label htmlFor="notes" className="form-label fw-bold">
                          <i className="bi bi-journal-text me-1"></i>Notas
                        </label>
                        <textarea
                          className="form-control form-control-lg"
                          id="notes"
                          rows={3}
                          value={notas}
                          onChange={e => setNotas(e.target.value)}
                          placeholder="Notas adicionales sobre la cita"
                        ></textarea>
                      </div>

                      <div className="d-grid gap-2">
                        <button
                          type="submit"
                          className="btn btn-lg"
                          style={{ backgroundColor: '#84c684ff', color: '#fff', borderColor: '#5cd65c' }}
                        >
                          <i className={`bi ${editingId !== null ? 'bi-check-circle' : 'bi-calendar-plus'} me-1`}></i>
                          {editingId !== null ? 'Actualizar Cita' : 'Programar Cita'}
                        </button>
                        {editingId !== null && (
                          <button
                            type="button"
                            className="btn btn-secondary btn-lg"
                            onClick={() => {
                              setEditingId(null);
                              setCliente('');
                              setFecha('');
                              setHora('');
                              setNotas('');
                              
                            }}
                          >
                            <i className="bi bi-x-circle me-1"></i>Cancelar Edición
                          </button>
                        )}
                      </div>
                    </form>
                  </div>
                </div>
              </div>     
                        <div className="col-lg-7 col-md-6">
                          <div className="card h-100 shadow-sm">
                            {/* Encabezado */}
                            <div className="card-header d-flex justify-content-between align-items-center bg-light">
                              <h5 className="mb-0">
                                <i className="bi bi-list-check me-1"></i>Citas Programadas
                              </h5>
                              <span className="badge bg-primary fs-6">{appointments.length} citas</span>
                            </div>

                            <div className="card-body">
                              {/* Barra de búsqueda */}
                              <div className="row mb-3">
                                <div className="col-md-12">
                                  <div className="input-group">
                                    <span className="input-group-text"><i className="bi bi-search"></i></span>
                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder="Buscar por ID o cliente..."
                                      value={searchTerm}
                                      onChange={e => setSearchTerm(e.target.value)}
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* Resultado vacío */}
                              {currentAppointments.length === 0 ? (
                                <div className="text-center py-5">
                                  {searchTerm ? (
                                    <>
                                      <i className="bi bi-search display-3 text-muted"></i>
                                      <p className="text-muted mt-3 fs-5">No se encontraron citas</p>
                                      <p className="text-muted">"{searchTerm}"</p>
                                      <button className="btn btn-primary mt-2" onClick={() => setSearchTerm('')}>Limpiar búsqueda</button>
                                    </>
                                  ) : (
                                    <>
                                      <i className="bi bi-calendar-x display-3 text-muted"></i>
                                      <p className="text-muted mt-3 fs-5">No hay citas programadas</p>
                                    </>
                                  )}
                                </div>
                              ) : (
                                <>
                                  {/* Tabla */}
                                  <div className="table-responsive">
                                    <table className="table table-hover table-striped align-middle fs-7">
                                      <thead className="table-dark">
                                        <tr>
                                          <th className="cursor-pointer" onClick={() => toggleSortOrder('id')}>
                                            ID {sortField === 'id' && (sortOrder === 'asc' ? '▲' : '▼')}
                                          </th>
                                          <th className="cursor-pointer" onClick={() => toggleSortOrder('nombre')}>
                                            <i className="bi bi-person me-1"></i>Cliente {sortField === 'nombre' && (sortOrder === 'asc' ? '▲' : '▼')}
                                          </th>
                                          <th className="cursor-pointer" onClick={() => toggleSortOrder('fecha')}>
                                            <i className="bi bi-calendar me-1"></i>Fecha {sortField === 'fecha' && (sortOrder === 'asc' ? '▲' : '▼')}
                                          </th>
                                          <th className="cursor-pointer" onClick={() => toggleSortOrder('hora')}>
                                            <i className="bi bi-clock me-1"></i>Hora {sortField === 'hora' && (sortOrder === 'asc' ? '▲' : '▼')}
                                          </th>
                                          <th><i className="bi bi-journal-text me-1"></i>Notas</th>
                                          <th>Acciones</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {currentAppointments.map(appointment => (
                                          <tr key={appointment.id}>
                                            <td>{appointment.id}</td>
                                            <td>{appointment.nombre}</td>
                                            <td>{formatDate(appointment.fecha)}</td>
                                            <td>{formatTime12h(appointment.hora)}</td>
                                            <td style={{ whiteSpace: 'normal' }}>{appointment.notas}</td>
                                            <td>
                                              <div className="btn-group" role="group">
                                                <button
                                                  className="btn btn-outline-primary btn-sm"
                                                  onClick={() => handleEdit(appointment)}
                                                  title="Editar cita"
                                                >
                                                  <i className="bi bi-pencil"></i>
                                                </button>
                                                <button
                                                  className="btn btn-outline-danger btn-sm"
                                                  onClick={() => handleDelete(appointment)}
                                                  title="Eliminar cita"
                                                >
                                                  <i className="bi bi-trash"></i>
                                                </button>
                                              </div>
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>

                                  {/* Paginador + Rango */}
                                  <div className="d-flex justify-content-between align-items-center mt-3">
                                    {/* Paginador */}
                                    <nav>
                                      <ul className="pagination mb-0">
                                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                          <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>Anterior</button>
                                        </li>
                                        {Array.from({ length: totalPages }, (_, i) => (
                                          <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                            <button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                                          </li>
                                        ))}
                                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                          <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>Siguiente</button>
                                        </li>
                                      </ul>
                                    </nav>

                                    {/* Rango de registros */}
                                    <div className="ms-auto text-end text-muted small">
                                      Registros {indexOfFirst + 1}–{Math.min(indexOfLast, sortedAppointments.length)} de {sortedAppointments.length}
                                    </div>
                                  </div>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          {/* Fin Lista */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
  );
};

export default Appointments;

