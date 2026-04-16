export const createInitialCuponFormData = () => ({
  codigo: "",
  tipoCupon: "porcentaje",
  valorDescuento: "",
  descripcion: "",
  fechaInicio: "",
  fechaVencimiento: "",
  usoMaximo: "",
  tipoUsuario: "todos",
  montoMinimo: "",
  enviarPorMail: false,
  destinatarios: [],
});

const esReciente = (fecha, dias = 30) => {
  if (!fecha) return false;
  const diff = (new Date() - new Date(fecha)) / (1000 * 60 * 60 * 24);
  return diff >= 0 && diff <= dias;
};

const obtenerSegmento = (cliente) => {
  const total = Number(cliente.totalCompras) || 0;
  const gasto = Number(cliente.totalGastado) || 0;
  const vip = total >= 5 || gasto >= 150000;
  const nuevo = total === 0 || esReciente(cliente.fecha_registro, 30);
  const activo = esReciente(cliente.ultimaCompra, 30);

  if (vip) return "vip";
  if (nuevo) return "nuevos";
  if (activo) return "activos_recientes";
  return "general";
};

export const filtrarClientesPorSegmento = (clientes, segmentoFiltro) =>
  clientes.filter((cliente) =>
    segmentoFiltro === "todos"
      ? true
      : obtenerSegmento(cliente) === segmentoFiltro,
  );
