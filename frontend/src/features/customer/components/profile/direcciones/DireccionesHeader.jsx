const DireccionesHeader = ({ maxDirecciones, pais, contador }) => {
  return (
    <div>
      <h1 className="text-2xl font-bold leading-tight text-gray-900 sm:text-3xl">
        Mis direcciones
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        Gestiona hasta {maxDirecciones} direcciones de envio. Disponible solo
        para {pais}.
      </p>
      <p className="mt-2 text-xs font-semibold text-primary-700">{contador}</p>
    </div>
  );
};

export default DireccionesHeader;
