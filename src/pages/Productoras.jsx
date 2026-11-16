import CrudPage from '../components/CrudPage';

export default function Productoras() {
  return (
    <CrudPage
      titulo="Productoras"
      endpoint="/productoras"
      campos={[
        { name: 'nombre', label: 'Nombre de la productora', required: true },
        { name: 'estado', label: 'Estado', type: 'select', options: ['Activo', 'Inactivo'], default: 'Activo' },
        { name: 'slogan', label: 'Slogan' },
        { name: 'descripcion', label: 'Descripción', type: 'textarea' }
      ]}
      columnas={[
        { key: 'nombre', label: 'Nombre' },
        { key: 'estado', label: 'Estado' },
        { key: 'slogan', label: 'Slogan' },
        { key: 'descripcion', label: 'Descripción' },
        { key: 'fechaCreacion', label: 'Creación', fecha: true },
        { key: 'fechaActualizacion', label: 'Actualización', fecha: true }
      ]}
    />
  );
}