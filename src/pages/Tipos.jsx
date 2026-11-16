import CrudPage from '../components/CrudPage';

export default function Tipos() {
  return (
    <CrudPage
      titulo="Tipos"
      endpoint="/tipos"
      campos={[
        { name: 'nombre', label: 'Nombre', required: true },
        { name: 'descripcion', label: 'Descripción', type: 'textarea' }
      ]}
      columnas={[
        { key: 'nombre', label: 'Nombre' },
        { key: 'descripcion', label: 'Descripción' },
        { key: 'fechaCreacion', label: 'Creación', fecha: true },
        { key: 'fechaActualizacion', label: 'Actualización', fecha: true }
      ]}
    />
  );
}