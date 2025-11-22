import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

interface Client {
  id: number;
  nombre: string;
  telefono: string;
  correo: string;
}

interface ClientsProps {
  toggleSidebar: () => void;
}

const Clients: React.FC<ClientsProps> = ({ toggleSidebar }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [telefonoError, setTelefonoError] = useState('');
  const [nombreError, setNombreError] = useState('');
  const [correoError, setCorreoError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'id' | 'nombre'>('nombre');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [initialFilter, setInitialFilter] = useState('');
  const recordsPerPage = 5;

  useEffect(() => {
    fetchClients();
  }, []);

  // 🔑 Reset a la primera página cuando cambie el término de búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const fetchClients = async () => {
    try {
      const res = await fetch('https://backend-production-e10c.up.railway.app/clientes');
      const data = await res.json();

      const simulated = Array.from({ length: 42 }, (_, i) => ({
      ...data.data[i % data.data.length],
      id: i + 1
    }));
      setClients(data.data);
    } catch (err) {
      console.error('Error al obtener clientes:', err);
    }
  };

  const validateNombre = (nombre: string) => {
    const trimmed = nombre.trim();
    const words = trimmed.split(/\s+/);
    if (words.length < 2) return false;
    const regex = /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+$/;
    return words.every(word => regex.test(word));
  };

  const validateCorreo = (correo: string) => {
    const regex =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|net|org|edu|gov|mil|info|co|es|hn)$/;
    return regex.test(correo.toLowerCase());
  };

  const validateTelefono = (telefono: string) => {
    const regex = /^\+504\s\d{4}-\d{4}$/;
    return regex.test(telefono);
  };

  const handleTelefonoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTelefono(value);
    if (value && !validateTelefono(value)) {
      setTelefonoError('Formato inválido. Use: +504 3258-8956');
    } else {
      setTelefonoError('');
    }
  };

  const formatTelefonoInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.startsWith('504')) value = value.slice(3);
    if (value.length > 8) value = value.slice(0, 8);
    if (value.length >= 4) {
      setTelefono(`+504 ${value.slice(0, 4)}-${value.slice(4)}`);
    } else {
      setTelefono(`+504 ${value}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;

    if (!validateNombre(nombre)) {
      setNombreError('Ingrese nombre y apellido con mayúsculas iniciales.');
      valid = false;
    } else setNombreError('');

    if (!validateCorreo(correo)) {
      setCorreoError('Correo electrónico inválido.');
      valid = false;
    } else setCorreoError('');

    if (!validateTelefono(telefono)) {
      setTelefonoError('Formato inválido. Use: +504 3258-8956');
      valid = false;
    } else setTelefonoError('');

    if (!valid) return;

    const payload = { nombre, telefono, correo };

    try {
      const url =
        editingId !== null
          ? `https://backend-production-e10c.up.railway.app/clientes/edit/${editingId}`
          : 'https://backend-production-e10c.up.railway.app/clientes/register';
      const method = editingId !== null ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Error al guardar cliente');

      await fetchClients();

      // ✅ Alert de éxito sin botón OK que se cierra solo
      Swal.fire({
        icon: 'success',
        title:
          editingId !== null
            ? 'Cliente editado correctamente'
            : 'Cliente registrado correctamente',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      });

      setNombre('');
      setTelefono('');
      setCorreo('');
      setEditingId(null);
    } catch (err) {
      console.error('Error al guardar cliente:', err);
      Swal.fire(
        'Error',
        'No se pudo guardar el cliente. Revisa los datos o el servidor.',
        'error'
      );
    }
  };

  const handleEdit = (client: Client) => {
    setNombre(client.nombre);
    setTelefono(client.telefono);
    setCorreo(client.correo);
    setEditingId(client.id);
    setTelefonoError('');
  };

  const handleDelete = async (id: number) => {
    const client = clients.find(c => c.id === id);
    const confirm = await Swal.fire({
      title: `¿Desea eliminar al cliente ${client?.nombre}?`,
      text: `Con ID: ${id}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    });
      if (confirm.isConfirmed) {
        try {
          const res = await fetch(
            `http://localhost:3001/clientes/delete/${id}`,
            { method: 'DELETE' }
          );
          if (!res.ok) throw new Error('Error al eliminar cliente');

          await fetchClients();

          // ✅ Alert de eliminación sin botón OK que se cierra solo
          Swal.fire({
            icon: 'success',
            title: `Cliente eliminado correctamente`,
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true
          });
        } catch (err) {
          console.error('Error al eliminar cliente:', err);
        }
      }

  };

  // 🔎 Filtro por nombre o id
    const filteredClients = clients.filter(c => {
      const matchesSearch =
        c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.id.toString() === searchTerm;

      const matchesInitial =
        initialFilter === '' || c.nombre.toLowerCase().startsWith(initialFilter.toLowerCase());

      return matchesSearch && matchesInitial;
    });


  // 🔀 Ordenamiento
  const sortedClients = [...filteredClients].sort((a, b) => {
    if (sortField === 'id')
      return sortOrder === 'asc' ? a.id - b.id : b.id - a.id;
    return sortOrder === 'asc'
      ? a.nombre.localeCompare(b.nombre)
      : b.nombre.localeCompare(a.nombre);
  });

  const toggleSortOrder = (field: 'id' | 'nombre') => {
    if (sortField === field)
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // 📄 Paginación
  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentClients = sortedClients.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(sortedClients.length / recordsPerPage);
return (
  <div className="main-content">
    <div className="dashboard-header">
      <button className="sidebar-toggle d-lg-none" onClick={toggleSidebar}>
        <i className="bi bi-list"></i>
      </button>
      <h2 className="fs-2">Gestión de Clientes</h2>
    </div>

    <div className="dashboard-content">
      <div className="row justify-content-center">
        <div className="col-12">
          <div className="card mx-auto shadow-lg border-0" style={{ maxWidth: '1400px' }}>
            <div className="card-header bg-primary text-white py-3">
              <h4 className="mb-0 text-center fs-3" style={{ color: 'black' }}>
                <i className="bi bi-people-fill me-2"></i>
                ROBLES DE LA LAGUNA - Gestión de Clientes
              </h4>
            </div>

            <div className="card-body p-4">
               <div className="row g-4">
                {/* Formulario */}
                <div className="col-lg-5 col-md-6">
                  <div className="card h-100 shadow-sm">
                    <div className="card-header bg-light">
                      <h5 className="mb-0 text-center">
                        <i className={`bi ${editingId !== null ? 'bi-check-circle' : 'bi-person-plus'} me-1`}></i>
                        {editingId !== null ? 'Editar Cliente' : 'Agregar Nuevo Cliente'}
                      </h5>
                    </div>
                    <div className="card-body">
                      <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                          <label htmlFor="nombre" className="form-label fw-bold">
                            <i className="bi bi-person me-1"></i>Nombre Completo
                          </label>
                          <input
                            type="text"
                            className={`form-control form-control-lg ${nombreError ? 'is-invalid' : ''}`}
                            id="nombre"
                            value={nombre}
                            onChange={e => setNombre(e.target.value)}
                            placeholder="Ingrese el nombre completo"
                            required
                          />
                          {nombreError && <div className="invalid-feedback d-block">{nombreError}</div>}
                        </div>

                        <div className="mb-3">
                          <label htmlFor="telefono" className="form-label fw-bold">
                            <i className="bi bi-phone me-1"></i>Teléfono
                          </label>
                          <input
                            type="text"
                            className={`form-control form-control-lg ${telefonoError ? 'is-invalid' : ''}`}
                            id="telefono"
                            value={telefono}
                            onChange={handleTelefonoChange}
                            onInput={formatTelefonoInput}
                            placeholder="+504 1234-5678"
                            maxLength={15}
                            required
                          />
                          {telefonoError && <div className="invalid-feedback d-block">{telefonoError}</div>}
                        </div>

                        <div className="mb-3">
                          <label htmlFor="correo" className="form-label fw-bold">
                            <i className="bi bi-envelope me-1"></i>Correo Electrónico
                          </label>
                          <input
                            type="email"
                            className={`form-control form-control-lg ${correoError ? 'is-invalid' : ''}`}
                            id="correo"
                            value={correo}
                            onChange={e => setCorreo(e.target.value)}
                            placeholder="correo@gmail.com"
                            required
                          />
                          {correoError && <div className="invalid-feedback d-block">{correoError}</div>}
                        </div>

                        <div className="d-grid gap-2">
                          <button
                            type="submit"
                            className="btn btn-lg"
                            style={{ backgroundColor: '#84c684ff', color: '#fff', borderColor: '#5cd65c' }}
                            disabled={!!telefonoError}
                          >
                            <i className={`bi ${editingId !== null ? 'bi-check-circle' : 'bi-person-check'} me-1`} style={{ fontSize: '1.6rem' }}></i>
                            {editingId !== null ? 'Actualizar Cliente' : 'Registrar Cliente'}
                          </button>

                          {editingId !== null && (
                            <button
                              type="button"
                              className="btn btn-secondary btn-lg"
                              onClick={() => {
                                setEditingId(null);
                                setNombre('');
                                setTelefono('');
                                setCorreo('');
                                setTelefonoError('');
                              }}
                            >
                              <i className="bi bi-x-circle me-1"></i>
                              Cancelar Edición
                            </button>
                          )}
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                 {/* Lista de Clientes */}
                <div className="col-lg-7 col-md-6">
                  <div className="card h-100 shadow-sm">
                    <div className="card-header d-flex justify-content-between align-items-center bg-light">
                      <h5 className="mb-0"><i className="bi bi-list-check me-1"></i>Lista de Clientes</h5>
                      <span className="badge bg-primary fs-6">{clients.length} clientes</span>
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
                              placeholder="Buscar por ID o nombre"
                              value={searchTerm}
                              onChange={e => setSearchTerm(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>

                      {currentClients.length === 0 ? (
                        <div className="text-center py-5">
                          {searchTerm ? (
                            <>
                              <i className="bi bi-search display-3 text-muted"></i>
                              <p className="text-muted mt-3 fs-5">No se encontraron clientes</p>
                              <p className="text-muted">"{searchTerm}"</p>
                              <button className="btn btn-primary mt-2" onClick={() => setSearchTerm('')}>Limpiar búsqueda</button>
                            </>
                          ) : (
                            <>
                              <i className="bi bi-people display-3 text-muted"></i>
                              <p className="text-muted mt-3 fs-5">No hay clientes registrados</p>
                            </>
                          )}
                        </div>
                      ) : (
                        <>
                          <div className="table-responsive">
                            <table className="table table-hover table-striped align-middle fs-7">
                              <thead className="table-dark">
                                <tr>
                                  <th className="cursor-pointer" onClick={() => toggleSortOrder('id')}>
                                    ID {sortField === 'id' && (sortOrder === 'asc' ? '▲' : '▼')}
                                  </th>
                                  <th className="cursor-pointer" onClick={() => toggleSortOrder('nombre')}>
                                    <i className="bi bi-person me-1"></i>
                                    Cliente {sortField === 'nombre' && (sortOrder === 'asc' ? '▲' : '▼')}
                                  </th>
                                  <th><i className="bi bi-phone me-1"></i>Teléfono</th>
                                  <th><i className="bi bi-envelope me-1"></i>Correo</th>
                                  <th><i className="bi bi-gear me-1"></i>Acciones</th>
                                </tr>
                              </thead>
                              <tbody>
                                {currentClients.map(client => (
                                  <tr key={client.id}>
                                    <td className="align-middle fw-bold">{client.id}</td>
                                    <td className="align-middle">{client.nombre}</td>
                                    <td className="align-middle text-nowrap">{client.telefono}</td>
                                    <td className="align-middle">{client.correo}</td>
                                    <td>
                                      <div className="btn-group" role="group">
                                        <button
                                          className="btn btn-outline-primary btn-sm"
                                          onClick={() => handleEdit(client)}
                                          title="Editar cliente"
                                        >
                                          <i className="bi bi-pencil"></i>
                                        </button>
                                        <button
                                          className="btn btn-outline-danger btn-sm"
                                          onClick={() => handleDelete(client.id)}
                                          title="Eliminar cliente"
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
                          {/* Paginador centrado */}
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

                          {/* Texto de rango alineado a la derecha */}
                          <div className="ms-auto text-end text-muted small">
                            Registros {indexOfFirst + 1}–{Math.min(indexOfLast, sortedClients.length)} de {sortedClients.length}
                          </div>
                        </div>

                        </>
                      )}
                    </div>
                  </div>
                </div>
                {/* Fin lista */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

};

export default Clients;
