import { create } from "zustand";

export const useVentasOnlineStore = create((set) => ({
  // Estado
  ventas: [],
  productosDisponibles: [],
  cargando: false,
  filtro: "",
  filtroEstado: "Todos",
  paginaActual: 1,
  itemsPorPagina: 6,

  // Acciones
  setVentas: (ventas) => set({ ventas }),
  setProductosDisponibles: (productos) =>
    set({ productosDisponibles: productos }),
  setCargando: (cargando) => set({ cargando }),
  setFiltro: (filtro) => set({ filtro, paginaActual: 1 }),
  setFiltroEstado: (filtroEstado) => set({ filtroEstado, paginaActual: 1 }),
  setPaginaActual: (paginaActual) => set({ paginaActual }),

  // Actualizar estado de una venta específica
  updateVentaEstado: (idVentaO, nuevoEstado) => {
    set((state) => ({
      ventas: state.ventas.map((v) =>
        v.idVentaO === idVentaO ? { ...v, estado: nuevoEstado } : v,
      ),
    }));
  },
}));
