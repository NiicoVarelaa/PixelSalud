import { create } from "zustand";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const API_URL_ALL = `${API_BASE_URL}/productos`;
const API_URL_CAMPANAS_ACTIVAS = `${API_BASE_URL}/campanas/activas`;
const HIDDEN_PUBLIC_CATEGORY = "Medicamentos con Receta";

const PRODUCTS_PER_SECTION = 6;

const normalizeCampaignProduct = (product, campana = null) => {
  const precioBase = Number(product?.precio) || 0;
  const porcentajeDescuento = Number(product?.descuentoFinal) || 0;
  const precioFinal =
    porcentajeDescuento > 0
      ? precioBase * (1 - porcentajeDescuento / 100)
      : precioBase;

  return {
    ...product,
    enOferta: true,
    isCyberMonday: String(campana?.nombreCampana || "")
      .toLowerCase()
      .includes("cyber"),
    porcentajeDescuento,
    precioRegular: precioBase,
    precioFinal,
    tipoPromocion: campana?.tipo || product?.tipoPromocion || null,
    promo2x1Activa:
      String(campana?.tipo || product?.tipoPromocion || "").toUpperCase() ===
      "2X1",
  };
};

export const useProductStore = create((set) => ({
  productosArriba: [],
  productosAbajo: [],
  productosCyberMonday: [],
  campanasInicio: [],
  productos: [],
  categorias: [],
  isLoading: false,
  error: null,

  fetchProducts: async () => {
    set({ isLoading: true, error: null });

    try {
      const [resAll, resCampanas] = await Promise.all([
        axios.get(API_URL_ALL),
        axios.get(API_URL_CAMPANAS_ACTIVAS).catch(() => ({ data: [] })),
      ]);

      const todos = resAll.data;
      const campanasActivas = resCampanas.data || [];

      const productosDisponiblesArriba = todos.filter(
        (p) => p.categoria !== HIDDEN_PUBLIC_CATEGORY,
      );
      const shuffledArriba = [...productosDisponiblesArriba].sort(
        () => Math.random() - 0.5,
      );
      const arriba = shuffledArriba.slice(0, PRODUCTS_PER_SECTION);

      const productosEnOferta = todos.filter((producto) => {
        const tieneOfertasArray =
          Array.isArray(producto.ofertas) && producto.ofertas.length > 0;
        const tieneBanderaOferta = Boolean(producto.enOferta);
        const tieneDescuento = Number(producto.porcentajeDescuento) > 0;

        return tieneOfertasArray || tieneBanderaOferta || tieneDescuento;
      });

      const abajo = productosEnOferta.slice(0, PRODUCTS_PER_SECTION);

      const campanasConProductos = await Promise.all(
        campanasActivas.map(async (campana) => {
          const responseCampana = await axios
            .get(`${API_BASE_URL}/campanas/${campana.idCampana}/productos`)
            .catch(() => ({ data: { productos: [] } }));

          const productosCampana = (responseCampana.data?.productos || [])
            .filter(
              (p) => p?.categoria && p.categoria !== HIDDEN_PUBLIC_CATEGORY,
            )
            .map((p) => normalizeCampaignProduct(p, campana));

          return {
            idCampana: campana.idCampana,
            nombreCampana: campana.nombreCampana,
            descripcion: campana.descripcion || "",
            tipo: campana.tipo,
            fechaFin: campana.fechaFin,
            prioridad: Number(campana.prioridad || 0),
            productos: productosCampana,
          };
        }),
      );

      const campanasInicio = campanasConProductos.filter(
        (campana) =>
          Array.isArray(campana.productos) && campana.productos.length > 0,
      );

      const campanaCyberMonday = campanasInicio.find((campana) =>
        String(campana?.nombreCampana || "")
          .toLowerCase()
          .includes("cyber"),
      );
      const productosCyberMonday = campanaCyberMonday?.productos || [];

      let categoriasUnicas = [
        ...new Set(
          todos
            .map((p) => p.categoria)
            .filter((cat) => cat && cat !== HIDDEN_PUBLIC_CATEGORY),
        ),
      ];
      if (
        (campanasActivas.length > 0 || abajo.length > 0) &&
        !categoriasUnicas.includes("Ofertas")
      ) {
        categoriasUnicas = ["Ofertas", ...categoriasUnicas];
      }

      set({
        productosArriba: arriba,
        productosAbajo: abajo,
        productosCyberMonday,
        campanasInicio,
        productos: todos,
        categorias: categoriasUnicas,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error al traer productos:", error);
      set({
        error: "No se pudieron cargar los productos. Intenta más tarde.",
        isLoading: false,
      });
    }
  },
}));
