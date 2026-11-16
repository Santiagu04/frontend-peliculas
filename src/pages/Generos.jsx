import CrudPage from '../components/CrudPage';

export default function Generos() {
  return (
    <CrudPage
      titulo="Géneros"
      endpoint="/generos"
      campos={[
        { name: 'nombre', label: 'Nombre', required: true },
        { name: 'estado', label: 'Estado', type: 'select', options: ['Activo', 'Inactivo'], default: 'Activo' },
        { name: 'descripcion', label: 'Descripción', type: 'textarea' }
      ]}
      columnas={[
        { key: 'nombre', label: 'Nombre' },
        { key: 'estado', label: 'Estado' },
        { key: 'descripcion', label: 'Descripción' },
        { key: 'fechaCreacion', label: 'Creación', fecha: true },
        { key: 'fechaActualizacion', label: 'Actualización', fecha: true }
      ]}
    />
  );
}