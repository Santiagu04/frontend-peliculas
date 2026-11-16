import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import api from '../services/api';

const formatoFecha = (f) => (f ? new Date(f).toLocaleString('es-CO') : '');

export default function CrudPage({ titulo, endpoint, campos, columnas }) {
  // Estado inicial vacío del formulario, construido a partir de los campos
  const vacio = campos.reduce(
    (acc, c) => ({ ...acc, [c.name]: c.default ?? '' }),
    {}
  );

  const [items, setItems] = useState([]);
  const [form, setForm] = useState(vacio);
  const [editandoId, setEditandoId] = useState(null);

  // Carga la lista desde la API
  const cargar = async () => {
    try {
      const { data } = await api.get(endpoint);
      setItems(data);
    } catch (e) {
      Swal.fire('Error', 'No se pudo cargar la información. ¿Está encendida la API?', 'error');
    }
  };

  useEffect(() => {
    cargar();
  }, [endpoint]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const limpiar = () => {
    setForm(vacio);
    setEditandoId(null);
  };

  // Crear (POST) o editar (PUT)
  const guardar = async (e) => {
    e.preventDefault();
    try {
      if (editandoId) {
        await api.put(`${endpoint}/${editandoId}`, form);
      } else {
        await api.post(endpoint, form);
      }
      Swal.fire({
        icon: 'success',
        title: editandoId ? 'Actualizado correctamente' : 'Creado correctamente',
        timer: 1500,
        showConfirmButton: false
      });
      limpiar();
      cargar();
    } catch (err) {
      Swal.fire('Error', err.response?.data?.mensaje || 'Ocurrió un error', 'error');
    }
  };

  // Pasa los datos de una fila al formulario para editarla
  const editar = (item) => {
    const datos = campos.reduce(
      (acc, c) => ({ ...acc, [c.name]: item[c.name] ?? '' }),
      {}
    );
    setForm(datos);
    setEditandoId(item._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Eliminar (DELETE) con confirmación
  const eliminar = async (item) => {
    const respuesta = await Swal.fire({
      title: '¿Eliminar registro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (!respuesta.isConfirmed) return;

    try {
      await api.delete(`${endpoint}/${item._id}`);
      Swal.fire({ icon: 'success', title: 'Eliminado', timer: 1500, showConfirmButton: false });
      cargar();
    } catch (err) {
      Swal.fire('Error', err.response?.data?.mensaje || 'No se pudo eliminar', 'error');
    }
  };

  return (
    <div>
      <h2 className="mb-3">{titulo}</h2>

      {/* FORMULARIO */}
      <form onSubmit={guardar} className="card card-body mb-4">
        <h5 className="mb-3">{editandoId ? 'Editar registro' : 'Nuevo registro'}</h5>
        <div className="row">
          {campos.map((c) => (
            <div className="col-md-6 mb-3" key={c.name}>
              <label className="form-label">{c.label}</label>

              {c.type === 'select' ? (
                <select
                  className="form-select"
                  name={c.name}
                  value={form[c.name]}
                  onChange={handleChange}
                >
                  {c.options.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              ) : c.type === 'textarea' ? (
                <textarea
                  className="form-control"
                  name={c.name}
                  value={form[c.name]}
                  onChange={handleChange}
                  rows="2"
                />
              ) : (
                <input
                  type="text"
                  className="form-control"
                  name={c.name}
                  value={form[c.name]}
                  onChange={handleChange}
                  required={c.required}
                />
              )}
            </div>
          ))}
        </div>
        <div>
          <button type="submit" className="btn btn-primary me-2">
            {editandoId ? 'Actualizar' : 'Guardar'}
          </button>
          {editandoId && (
            <button type="button" className="btn btn-secondary" onClick={limpiar}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* TABLA */}
      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle">
          <thead className="table-dark">
            <tr>
              {columnas.map((col) => (
                <th key={col.key}>{col.label}</th>
              ))}
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr>
                <td colSpan={columnas.length + 1} className="text-center text-muted">
                  No hay registros
                </td>
              </tr>
            )}
            {items.map((item) => (
              <tr key={item._id}>
                {columnas.map((col) => (
                  <td key={col.key}>
                    {col.fecha ? (
                      formatoFecha(item[col.key])
                    ) : col.key === 'estado' ? (
                      <span className={`badge ${item.estado === 'Activo' ? 'bg-success' : 'bg-secondary'}`}>
                        {item.estado}
                      </span>
                    ) : (
                      item[col.key]
                    )}
                  </td>
                ))}
                <td>
                  <button className="btn btn-sm btn-warning me-2" onClick={() => editar(item)}>
                    Editar
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={() => eliminar(item)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}