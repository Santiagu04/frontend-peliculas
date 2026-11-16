import CrudPage from '../components/CrudPage';

export default function Directores() {
  return (
    <CrudPage
      titulo="Directores"
      endpoint="/directores"
      campos={[
        { name: 'nombres', label: 'Nombres', required: true },
        { name: 'estado', label: 'Estado', type: 'select', options: ['Activo', 'Inactivo'], default: 'Activo' }
      ]}
      columnas={[
        { key: 'nombres', label: 'Nombres' },
        { key: 'estado', label: 'Estado' },
        { key: 'fechaCreacion', label: 'Creación', fecha: true },
        { key: 'fechaActualizacion', label: 'Actualización', fecha: true }
      ]}
    />
  );
}