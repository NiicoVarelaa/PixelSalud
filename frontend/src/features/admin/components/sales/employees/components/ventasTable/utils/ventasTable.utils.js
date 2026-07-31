const normalizarTextoBusqueda = (valor) =>
  String(valor || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

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
  const fechaRaw = String(venta?.fechaPago || "").trim();
  const horaRaw = String(venta?.horaPago || "").trim();
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

const filtrarVentas = (ventas, filtro, filtroEstado) => {
  const termino = normalizarTextoBusqueda(filtro);

  return ventas.filter((venta) => {
    const id = normalizarTextoBusqueda(venta.idVentaE);
    const dni = normalizarTextoBusqueda(venta.dniEmpleado);
    const nombre = normalizarTextoBusqueda(venta.nombreEmpleado);
    const apellido = normalizarTextoBusqueda(venta.apellidoEmpleado);
    const nombreCompleto = `${nombre} ${apellido}`.trim();
    const apellidoNombre = `${apellido} ${nombre}`.trim();

    const coincideBusqueda =
      id.includes(termino) ||
      dni.includes(termino) ||
      nombreCompleto.includes(termino) ||
      apellidoNombre.includes(termino);

    const coincideEstado =
      filtroEstado === "todas" ? true : venta.estado === filtroEstado;

    return coincideBusqueda && coincideEstado;
  });
};

const ordenarVentas = (ventas, filtroOrden) => {
  return [...ventas].sort((a, b) => {
    const fechaA = parseVentaTimestamp(a);
    const fechaB = parseVentaTimestamp(b);

    if (fechaA === fechaB) {
      return Number(b.idVentaE || 0) - Number(a.idVentaE || 0);
    }

    if (filtroOrden === "mas_viejo") {
      return fechaA - fechaB;
    }

    return fechaB - fechaA;
  });
};

export const obtenerItemsPagina = ({
  ventas,
  filtro,
  filtroEstado,
  filtroOrden,
  paginaActual,
  itemsPorPagina,
}) => {
  const ventasFiltradas = filtrarVentas(ventas, filtro, filtroEstado);
  const ventasOrdenadas = ordenarVentas(ventasFiltradas, filtroOrden);
  const indiceUltimo = paginaActual * itemsPorPagina;

  return ventasOrdenadas.slice(indiceUltimo - itemsPorPagina, indiceUltimo);
};

export const formatearFechaVenta = (fecha) =>
  !fecha ? "-" : new Date(fecha).toLocaleDateString("es-ES");

export { formatMoneda as formatearMonedaVenta } from "@utils/formatMoneda";
