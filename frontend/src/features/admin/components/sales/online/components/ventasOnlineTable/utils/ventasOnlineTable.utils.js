export const normalizeEstado = (estado) => String(estado || "").toLowerCase();

export const ESTADO_OPTIONS = [
  { value: "pendiente", label: "Pendiente" },
  { value: "retirado", label: "Retirado" },
  { value: "cancelado", label: "Cancelado" },
];

const parseHora = (horaRaw) => {
  if (!horaRaw) {
    return { horas: 0, minutos: 0, segundos: 0 };
  }

  const [h = "0", m = "0", s = "0"] = String(horaRaw).split(":");

  return {
    horas: Number.parseInt(h, 10) || 0,
    minutos: Number.parseInt(m, 10) || 0,
    segundos: Number.parseInt(s, 10) || 0,
  };
};

const parseVentaTimestamp = (venta) => {
  const fechaRaw = String(
    venta?.fechaPago || venta?.fecha || venta?.createdAt || "",
  ).trim();
  const horaRaw = String(venta?.horaPago || venta?.hora || "").trim();
  const { horas, minutos, segundos } = parseHora(horaRaw);

  if (!fechaRaw) {
    return 0;
  }

  const matchIsoSimple = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(fechaRaw);
  if (matchIsoSimple) {
    const [, y, mo, d] = matchIsoSimple;
    return new Date(
      Number(y),
      Number(mo) - 1,
      Number(d),
      horas,
      minutos,
      segundos,
    ).getTime();
  }

  const matchLatam = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(fechaRaw);
  if (matchLatam) {
    const [, d, mo, y] = matchLatam;
    return new Date(
      Number(y),
      Number(mo) - 1,
      Number(d),
      horas,
      minutos,
      segundos,
    ).getTime();
  }

  const parsed = new Date(fechaRaw);
  if (Number.isNaN(parsed.getTime())) {
    return 0;
  }

  if (horaRaw) {
    parsed.setHours(horas, minutos, segundos, 0);
  }

  return parsed.getTime();
};

export const obtenerItemsPagina = ({
  ventas,
  filtro,
  filtroEstado,
  filtroOrden,
  paginaActual,
  itemsPorPagina,
}) => {
  const txt = String(filtro || "").toLowerCase();
  const estadoFiltro = normalizeEstado(filtroEstado);

  const ventasFiltradas = ventas.filter((venta) => {
    const nombre = String(venta.nombreCliente || "").toLowerCase();
    const apellido = String(venta.apellidoCliente || "").toLowerCase();
    const nombreCompleto = `${nombre} ${apellido}`;
    const id = venta.idVentaO?.toString() || "";
    const dni = venta.dniCliente?.toString() || "";

    const coincideBusqueda =
      nombreCompleto.includes(txt) || id.includes(txt) || dni.includes(txt);

    const estadoVenta = normalizeEstado(venta.estado);
    const coincideEstado =
      estadoFiltro === "todas" ? true : estadoVenta === estadoFiltro;

    return coincideBusqueda && coincideEstado;
  });

  const ordenAscendente = filtroOrden === "mas_viejo";
  const ventasOrdenadas = [...ventasFiltradas].sort((a, b) => {
    const fechaA = parseVentaTimestamp(a);
    const fechaB = parseVentaTimestamp(b);

    if (fechaA !== fechaB) {
      return ordenAscendente ? fechaA - fechaB : fechaB - fechaA;
    }

    const idA = Number(a.idVentaO || 0);
    const idB = Number(b.idVentaO || 0);

    return ordenAscendente ? idA - idB : idB - idA;
  });

  const indiceUltimo = paginaActual * itemsPorPagina;
  return ventasOrdenadas.slice(indiceUltimo - itemsPorPagina, indiceUltimo);
};

export const formatearFechaVentaOnline = (fecha) =>
  !fecha ? "-" : new Date(fecha).toLocaleDateString("es-ES");

export const formatearMonedaVentaOnline = (valor) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(Number(valor) || 0);
