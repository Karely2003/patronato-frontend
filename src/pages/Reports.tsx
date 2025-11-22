import React, { useEffect, useState } from 'react';

interface ClienteResumen {
  id: number;
  nombre: string;
  telefono: string;
  correo: string;
  totalPagado: number;
  ultimoPago: string;
  cantidadPagos: number;
  cantidadCitas: number;
  ultimaCita: string;
  citaProxima: string;
}

interface ReportsProps {
  toggleSidebar?: () => void;
}

const Reports: React.FC<ReportsProps> = ({ toggleSidebar }) => {
  const [reporte, setReporte] = useState<ClienteResumen[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 25;

  useEffect(() => {
    fetch('http://localhost:3001/reportes/clientes-resumen')
      .then(res => res.json())
      .then(data => setReporte(data.data))
      .catch(err => console.error('Error al cargar reporte:', err));
  }, []);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

  const formatDateWithTime = (dateString: string) => {
    const date = new Date(dateString);
    const fecha = date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    const hora = date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    return `${fecha} – ${hora}`;
  };

  const filteredReporte = reporte.filter(c =>
    c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.telefono.includes(searchTerm)
  );

  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentReporte = filteredReporte.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredReporte.length / recordsPerPage);

  return (
    <div className="main-content">
      <div className="dashboard-header">
        <button className="sidebar-toggle d-lg-none" onClick={toggleSidebar}>
          <i className="bi bi-list"></i>
        </button>
        <h2 className="fs-2">Reportes Generales</h2>
      </div>

      <div className="dashboard-content container-fluid p-4">
        <div className="card mx-auto shadow-lg border-0" style={{ maxWidth: '1400px' }}>
          <div className="card-header bg-primary text-white py-3">
            <h4 className="mb-0 text-center fs-3" style={{ color: 'black' }}>
              <i className="bi bi-bar-chart-fill me-2"></i>
              ROBLES DE LA LAGUNA - Reporte de Clientes
            </h4>
          </div>

          <div className="card-body p-4">
            {/* Barra de búsqueda */}
            <div className="input-group mb-3">
              <span className="input-group-text"><i className="bi bi-search"></i></span>
              <input
                type="text"
                className="form-control"
                placeholder="Buscar por nombre, correo o teléfono..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            {currentReporte.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-clipboard-data display-3 text-muted"></i>
                <p className="text-muted mt-3 fs-5">No hay datos disponibles</p>
              </div>
            ) : (
              <>
                <div className="table-responsive">
                  <table className="table table-hover table-striped align-middle">
                    <thead className="table-dark">
                      <tr>
                        <th><i className="bi bi-person-fill me-1"></i>Cliente</th>
                        <th><i className="bi bi-telephone-fill me-1"></i>Teléfono</th>
                        <th><i className="bi bi-envelope-fill me-1"></i>Correo</th>
                        <th><i className="bi bi-cash-coin me-1"></i>Total Pagado</th>
                        <th><i className="bi bi-calendar-check me-1"></i>Último Pago</th>
                        <th><i className="bi bi-wallet2 me-1"></i>Nº Pagos</th>
                        <th><i className="bi bi-calendar-event me-1"></i>Nº Citas</th>
                        <th><i className="bi bi-calendar-date me-1"></i>Última Cita</th>
                        <th><i className="bi bi-calendar2-week me-1"></i>Tengo Cita</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentReporte.map(c => (
                        <tr key={c.id}>
                          <td>{c.nombre}</td>
                          <td>{c.telefono}</td>
                          <td>{c.correo}</td>
                          <td>L {c.totalPagado.toLocaleString('es-HN', { minimumFractionDigits: 2 })}</td>
                          <td>{formatDate(c.ultimoPago)}</td>
                          <td>{c.cantidadPagos}</td>
                          <td>{c.cantidadCitas}</td>
                          <td>{formatDateWithTime(c.ultimaCita)}</td>
                          <td>
                            <span className={`badge ${c.citaProxima === 'Sí' ? 'bg-success' : 'bg-secondary'}`}>
                              {c.citaProxima}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Paginador + Rango */}
                <div className="d-flex justify-content-between align-items-center mt-3">
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

                  <div className="ms-auto text-end text-muted small">
                    Mostrando registros {indexOfFirst + 1}–{Math.min(indexOfLast, filteredReporte.length)} de {filteredReporte.length}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
