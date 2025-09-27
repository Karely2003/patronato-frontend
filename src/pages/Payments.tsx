import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

interface Payment {
  id: number;
  cliente_id: number;
  nombre: string;
  monto: number;
  fecha: string;
}

interface Client {
  id: number;
  nombre: string;
}

interface PaymentsProps {
  toggleSidebar?: () => void;
}

const Payments: React.FC<PaymentsProps> = ({ toggleSidebar }) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [clientes, setClientes] = useState<Client[]>([]);
  const [nombre, setNombre] = useState('');
  const [monto, setMonto] = useState('');
  const [fecha, setFecha] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'id' | 'nombre' | 'monto' | 'fecha'>('nombre');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [nombreError, setNombreError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  useEffect(() => {
    fetchPayments();
    fetchClientes();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await fetch('http://localhost:3001/pagos');
      const data = await res.json();
      setPayments(data.data);
    } catch (err) {
      console.error('Error al cargar pagos:', err);
    }
  };

  const fetchClientes = async () => {
    try {
      const res = await fetch('http://localhost:3001/clientes');
      const data = await res.json();
      setClientes(data.data);
    } catch (err) {
      console.error('Error al cargar clientes:', err);
    }
  };

  const validateName = (name: string) => {
    const trimmed = name.trim();
    const words = trimmed.split(/\s+/);
    if (words.length < 2) return false;
    const nameRegex = /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+$/;
    return words.every(word => nameRegex.test(word));
  };

  const formatMonto = (value: string) => {
    const numericValue = value.replace(/[^\d.]/g, '');
    if (!numericValue) return '';
    const number = parseFloat(numericValue);
    if (!isNaN(number)) {
      return `L ${number.toLocaleString('es-HN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`;
    }
    return value;
  };

  const handleMontoChange = (e: React.ChangeEvent<HTMLInputElement>) => setMonto(e.target.value);
  const handleMontoBlur = () => { if (monto) setMonto(formatMonto(monto)); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre || !monto || !fecha) return;

    if (!validateName(nombre)) {
      setNombreError('El nombre y apellido deben iniciar con mayúscula');
      return;
    } else {
      setNombreError('');
    }

    try {
      const montoNum = parseFloat(monto.replace(/[^\d.]/g, ''));
      const payload = { nombre, monto: montoNum, fecha };

      const url = editingId !== null
        ? `http://localhost:3001/pagos/edit/${editingId}`
        : 'http://localhost:3001/pagos/register';

      const method = editingId !== null ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Error al guardar pago');

      await fetchPayments();
      setNombre('');
      setMonto('');
      setFecha('');
      setEditingId(null);

      Swal.fire({
        icon: 'success',
        title: editingId !== null ? 'Pago actualizado correctamente' : 'Pago registrado correctamente',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      });
    } catch (err) {
      console.error('Error al guardar pago:', err);
    }
  };

  const handleEdit = (payment: Payment) => {
    setNombre(payment.nombre);
    setMonto(payment.monto.toString());
    setFecha(payment.fecha);
    setEditingId(payment.id);
    setNombreError('');
  };

  const handleDelete = async (id: number) => {
    const payment = payments.find(p => p.id === id);
    if (!payment) return;

    const confirm = await Swal.fire({
      title: `¿Desea eliminar el pago de ${payment.nombre}?`,
      html: `<div class="text-muted">Fecha: ${formatDate(payment.fecha)}</div>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (confirm.isConfirmed) {
      try {
        const res = await fetch(`http://localhost:3001/pagos/delete/${id}`, {
          method: 'DELETE'
        });

        if (!res.ok) throw new Error('Error al eliminar pago');

        await fetchPayments();

        Swal.fire({
          icon: 'success',
          title: `Pago de ${payment.nombre} eliminado correctamente`,
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true
        });
      } catch (err) {
        console.error('Error al eliminar pago:', err);
      }
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

  const filteredPayments = payments.filter(p =>
    p.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id.toString() === searchTerm
  );

  const sortedPayments = [...filteredPayments].sort((a, b) => {
    if (sortField === 'id') return sortOrder === 'asc' ? a.id - b.id : b.id - a.id;
    if (sortField === 'nombre') return sortOrder === 'asc' ? a.nombre.localeCompare(b.nombre) : b.nombre.localeCompare(a.nombre);
    if (sortField === 'monto') return sortOrder === 'asc' ? a.monto - b.monto : b.monto - a.monto;
    return sortOrder === 'asc'
      ? new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
      : new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
  });

  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentPayments = sortedPayments.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(sortedPayments.length / recordsPerPage);

  const toggleSortOrder = (field: 'id' | 'nombre' | 'monto' | 'fecha') => {
    if (sortField === field) setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="main-content">
      <div className="dashboard-header">
        <button className="sidebar-toggle d-lg-none" onClick={toggleSidebar}>
          <i className="bi bi-list"></i>
        </button>
        <h2>Gestión de Pagos</h2>
      </div>

      <div className="dashboard-content container-fluid p-4">
        <div className="row justify-content-center">
          <div className="col-12">
            <div className="card mx-auto shadow-lg border-0" style={{ maxWidth: '1400px' }}>
              <div className="card-header bg-primary text-white py-3">
                <h4 className="mb-0 text-center fs-3" style={{ color: 'black' }}>
                  <i className="bi bi-currency-exchange me-2"></i>
                  ROBLES DE LA LAGUNA - Gestión de Pagos
                </h4>
              </div>

              <div className="card-body p-4">
                <div className="row g-4">
                  {/* Formulario */}
                  <div className="col-lg-5 col-md-6">
                    <div className="card h-100 shadow-sm">
                      <div className="card-header bg-light text-center">
                        <h5>
                          <i className="bi bi-plus-circle me-1"></i>
                          {editingId ? 'Editar Pago' : 'Registrar Nuevo Pago'}
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
                              value={nombre}
                              onChange={e => setNombre(e.target.value)}
                              placeholder="Seleccione o escriba el nombre del cliente"
                              required
                            />
                            <datalist id="clientes">
                              {clientes.map(c => (
                                <option key={c.id} value={c.nombre} />
                              ))}
                            </datalist>
                            {nombreError && <div className="text-danger small mt-1">{nombreError}</div>}
                          </div>


                          <div className="mb-3">
                            <label className="form-label fw-bold">
                              <i className="bi bi-cash-coin me-1"></i>Monto
                            </label>
                            <input
                              type="text"
                              className="form-control form-control-lg"
                              value={monto}
                              onChange={handleMontoChange}
                              onBlur={handleMontoBlur}
                              placeholder="25000.00"
                              required
                            />
                          </div>

                          <div className="mb-3">
                            <label className="form-label fw-bold">
                              <i className="bi bi-calendar-date me-1"></i>Fecha
                            </label>
                            <input
                              type="date"
                              className="form-control form-control-lg"
                              value={fecha}
                              onChange={e => setFecha(e.target.value)}
                              required
                            />
                          </div>

                          <div className="d-grid gap-2">
                            <button type="submit" className="btn btn-lg" style={{ backgroundColor: '#84c684ff', color: '#fff' }}>
                              <i className={`bi ${editingId ? 'bi-pencil-square' : 'bi-plus-circle'} me-1`}></i>
                              {editingId ? 'Actualizar Pago' : 'Registrar Pago'}
                            </button>
                            {editingId && (
                              <button
                                type="button"
                                className="btn btn-secondary btn-lg"
                                onClick={() => {
                                  setEditingId(null);
                                  setNombre('');
                                  setMonto('');
                                  setFecha('');
                                  setNombreError('');
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

                  {/* Tabla de pagos */}
                  <div className="col-lg-7 col-md-6">
                    <div className="card h-100 shadow-sm">
                      <div className="card-header d-flex justify-content-between align-items-center bg-light">
                        <h5 className="mb-0"><i className="bi bi-list-check me-1"></i>Historial de Pagos</h5>
                        <span className="badge bg-primary fs-6">{payments.length} pagos</span>
                      </div>
                      <div className="card-body">
                        <div className="input-group mb-3">
                          <span className="input-group-text"><i className="bi bi-search"></i></span>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Buscar por ID, cliente..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                          />
                        </div>

                        {currentPayments.length === 0 ? (
                          <div className="text-center py-5">
                            {searchTerm ? (
                              <>
                                <i className="bi bi-search display-3 text-muted"></i>
                                <p className="text-muted mt-3 fs-5">No se encontraron pagos</p>
                              </>
                            ) : (
                              <>
                                <i className="bi bi-wallet display-3 text-muted"></i>
                                <p className="text-muted mt-3 fs-5">No hay pagos registrados</p>
                              </>
                            )}
                          </div>
                        ) : (
                          <>
                            <div className="table-responsive">
                              <table className="table table-hover table-striped align-middle">
                                <thead className="table-dark">
                                  <tr>
                                    <th onClick={() => toggleSortOrder('id')} className="cursor-pointer">
                                      ID {sortField === 'id' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                                    </th>
                                    <th onClick={() => toggleSortOrder('nombre')} className="cursor-pointer">
                                      Cliente {sortField === 'nombre' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                                    </th>
                                    <th onClick={() => toggleSortOrder('monto')} className="cursor-pointer">
                                      Monto {sortField === 'monto' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                                    </th>
                                    <th onClick={() => toggleSortOrder('fecha')} className="cursor-pointer">
                                      Fecha {sortField === 'fecha' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                                    </th>
                                    <th>Acciones</th>
                                  </tr>
                                </thead>

                                <tbody>
                                  {currentPayments.map(p => (
                                    <tr key={p.id}>
                                      <td>{p.id}</td>
                                      <td>{p.nombre}</td>
                                      <td>L {p.monto.toLocaleString('es-HN', { minimumFractionDigits: 2 })}</td>
                                      <td>{formatDate(p.fecha)}</td>
                                      <td>
                                        <div className="btn-group" role="group">
                                          <button className="btn btn-outline-primary btn-sm" onClick={() => handleEdit(p)}>
                                            <i className="bi bi-pencil"></i>
                                          </button>
                                          <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(p.id)}>
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

                              {/* Rango de registros alineado a la derecha */}
                              <div className="ms-auto text-end text-muted small">
                                Registros {indexOfFirst + 1}–{Math.min(indexOfLast, sortedPayments.length)} de {sortedPayments.length}
                              </div>
                            </div>

                          </>
                        )}
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;
