import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import api from '../services/api';

const vacio = {
  serial: '',
  titulo: '',
  sinopsis: '',
  url: '',
  imagenPortada: '',
  anioEstreno: '',
  genero: '',
  director: '',
  productora: '',
  tipo: ''
};

export default function Medias() {
  const [medias, setMedias] = useState([]);
  const [generos, setGeneros] = useState([]);
  const [directores, setDirectores] = useState([]);
  const [productoras, setProductoras] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [form, setForm] = useState(vacio);
  const [editandoId, setEditandoId] = useState(null);

  const cargarMedias = async () => {
    try {
      const { data } = await api.get('/medias');
      setMedias(data);
    } catch (e) {
      Swal.fire('Error', 'No se pudieron cargar las producciones', 'error');
    }
  };

  const cargarListas = async () => {
    try {
      const [g, d, p, t] = await Promise.all([
        api.get('/generos'),
        api.get('/directores'),
        api.get('/productoras'),
        api.get('/tipos')
      ]);
      // Solo activos, según la regla del enunciado
      setGeneros(g.data.filter((x) => x.estado === 'Activo'));
      setDirectores(d.data.filter((x) => x.estado === 'Activo'));
      setProductoras(p.data.filter((x) => x.estado === 'Activo'));
      setTipos(t.data);
    } catch (e) {
      Swal.fire('Error', 'No se pudieron cargar las listas. ¿Está encendida la API?', 'error');
    }
  };

  useEffect(() => {
    cargarMedias();
    cargarListas();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const limpiar = () => {
    setForm(vacio);
    setEditandoId(null);
  };

  const guardar = async (e) => {
    e.preventDefault();
    try {
      if (editandoId) {
        await api.put(`/medias/${editandoId}`, form);
      } else {
        await api.post('/medias', form);
      }
      Swal.fire({
        icon: 'success',
        title: editandoId ? 'Actualizada correctamente' : 'Creada correctamente',
        timer: 1500,
        showConfirmButton: false
      });
      limpiar();
      cargarMedias();
    } catch (err) {
      Swal.fire('Error', err.response?.data?.mensaje || 'Ocurrió un error', 'error');
    }
  };

  const editar = (m) => {
    setForm({
      serial: m.serial,
      titulo: m.titulo,
      sinopsis: m.sinopsis || '',
      url: m.url,
      imagenPortada: m.imagenPortada || '',
      anioEstreno: m.anioEstreno || '',
      genero: m.genero?._id || '',
      director: m.director?._id || '',
      productora: m.productora?._id || '',
      tipo: m.tipo?._id || ''
    });
    setEditandoId(m._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const eliminar = async (m) => {
    const respuesta = await Swal.fire({
      title: `¿Eliminar "${m.titulo}"?`,
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (!respuesta.isConfirmed) return;

    try {
      await api.delete(`/medias/${m._id}`);
      Swal.fire({ icon: 'success', title: 'Eliminada', timer: 1500, showConfirmButton: false });
      cargarMedias();
    } catch (err) {
      Swal.fire('Error', err.response?.data?.mensaje || 'No se pudo eliminar', 'error');
    }
  };

  return (
    <div>
      <h2 className="mb-3">Media (Películas y series)</h2>

      {/* FORMULARIO */}
      <form onSubmit={guardar} className="card card-body mb-4">
        <h5 className="mb-3">{editandoId ? 'Editar producción' : 'Nueva producción'}</h5>
        <div className="row">
          <div className="col-md-4 mb-3">
            <label className="form-label">Serial (único)</label>
            <input className="form-control" name="serial" value={form.serial} onChange={handleChange} required />
          </div>
          <div className="col-md-8 mb-3">
            <label className="form-label">Título</label>
            <input className="form-control" name="titulo" value={form.titulo} onChange={handleChange} required />
          </div>

          <div className="col-12 mb-3">
            <label className="form-label">Sinopsis</label>
            <textarea className="form-control" name="sinopsis" rows="2" value={form.sinopsis} onChange={handleChange} />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">URL de la película (única)</label>
            <input className="form-control" name="url" value={form.url} onChange={handleChange} required />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">URL de la imagen de portada</label>
            <input className="form-control" name="imagenPortada" value={form.imagenPortada} onChange={handleChange} />
          </div>

          <div className="col-md-3 mb-3">
            <label className="form-label">Año de estreno</label>
            <input type="number" className="form-control" name="anioEstreno" value={form.anioEstreno} onChange={handleChange} />
          </div>
          <div className="col-md-3 mb-3">
            <label className="form-label">Género</label>
            <select className="form-select" name="genero" value={form.genero} onChange={handleChange} required>
              <option value="">Seleccione...</option>
              {generos.map((g) => (
                <option key={g._id} value={g._id}>{g.nombre}</option>
              ))}
            </select>
          </div>
          <div className="col-md-3 mb-3">
            <label className="form-label">Director</label>
            <select className="form-select" name="director" value={form.director} onChange={handleChange} required>
              <option value="">Seleccione...</option>
              {directores.map((d) => (
                <option key={d._id} value={d._id}>{d.nombres}</option>
              ))}
            </select>
          </div>
          <div className="col-md-3 mb-3">
            <label className="form-label">Productora</label>
            <select className="form-select" name="productora" value={form.productora} onChange={handleChange} required>
              <option value="">Seleccione...</option>
              {productoras.map((p) => (
                <option key={p._id} value={p._id}>{p.nombre}</option>
              ))}
            </select>
          </div>

          <div className="col-md-3 mb-3">
            <label className="form-label">Tipo</label>
            <select className="form-select" name="tipo" value={form.tipo} onChange={handleChange} required>
              <option value="">Seleccione...</option>
              {tipos.map((t) => (
                <option key={t._id} value={t._id}>{t.nombre}</option>
              ))}
            </select>
          </div>
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
              <th>Portada</th>
              <th>Serial</th>
              <th>Título</th>
              <th>Año</th>
              <th>Tipo</th>
              <th>Género</th>
              <th>Director</th>
              <th>Productora</th>
              <th>Ver</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {medias.length === 0 && (
              <tr>
                <td colSpan="10" className="text-center text-muted">No hay producciones</td>
              </tr>
            )}
            {medias.map((m) => (
              <tr key={m._id}>
                <td>
                  {m.imagenPortada ? (
                    <img src={m.imagenPortada} alt={m.titulo} style={{ width: 50, height: 70, objectFit: 'cover' }} />
                  ) : (
                    '—'
                  )}
                </td>
                <td>{m.serial}</td>
                <td>{m.titulo}</td>
                <td>{m.anioEstreno}</td>
                <td>{m.tipo?.nombre}</td>
                <td>{m.genero?.nombre}</td>
                <td>{m.director?.nombres}</td>
                <td>{m.productora?.nombre}</td>
                <td>
                  <a href={m.url} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-primary">
                    Abrir
                  </a>
                </td>
                <td>
                  <button className="btn btn-sm btn-warning me-2" onClick={() => editar(m)}>Editar</button>
                  <button className="btn btn-sm btn-danger" onClick={() => eliminar(m)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}