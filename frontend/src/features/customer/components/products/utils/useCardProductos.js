import { useCallback, useEffect, useMemo, useState } from "react";
import { useCarritoStore } from "@store/useCarritoStore";
import { useAuthStore } from "@store/useAuthStore";
import Default from "@assets/default.webp";
import apiClient from "@utils/apiClient";

const useCardProductos = ({ product }) => {
  const carrito = useCarritoStore((state) => state.carrito);
  const agregarCarrito = useCarritoStore((state) => state.agregarCarrito);
  const aumentarCantidad = useCarritoStore((state) => state.aumentarCantidad);
  const disminuirCantidad = useCarritoStore((state) => state.disminuirCantidad);
  const eliminarDelCarrito = useCarritoStore(
    (state) => state.eliminarDelCarrito,
  );
  const setShowLoginModal = useCarritoStore((state) => state.setShowLoginModal);

  const user = useAuthStore((state) => state.user);

  const [imageLoaded, setImageLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [principalImage, setPrincipalImage] = useState(product?.img || Default);

  useEffect(() => {
    const fetchPrincipalImage = async () => {
      if (!product?.idProducto) {
        setPrincipalImage(product?.img || Default);
        return;
      }

      try {
        const response = await apiClient.get(
          `/productos/${product.idProducto}/imagenes/principal`,
        );

        if (response.data?.urlImagen) {
          setPrincipalImage(response.data.urlImagen);
          return;
        }

        setPrincipalImage(product.img || Default);
      } catch {
        setPrincipalImage(product?.img || Default);
      }
    };

    fetchPrincipalImage();
  }, [product?.idProducto, product?.img]);

  const hoverImage = useMemo(() => {
    if (product?.img2) return product.img2;

    if (Array.isArray(product?.imagenes) && product.imagenes.length > 1) {
      const secondary = product.imagenes.find((img) => !img.esPrincipal);
      if (secondary?.urlImagen) return secondary.urlImagen;
      return product.imagenes[1]?.urlImagen || null;
    }

    return null;
  }, [product?.img2, product?.imagenes]);

  const cantidadEnCarrito = useMemo(() => {
    const item = carrito.find(
      (cartItem) => cartItem.idProducto === product?.idProducto,
    );
    return item?.cantidad || 0;
  }, [carrito, product?.idProducto]);

  const isOffert = Boolean(product?.enOferta);
  const isPromoDosPorUno =
    Boolean(product?.promo2x1Activa) ||
    String(product?.tipoPromocion || "").toUpperCase() === "2X1";
  const isCyberMondayProduct = Boolean(product?.isCyberMonday);
  const regularPrice = product?.precioRegular;
  const discountPercentage = Number(product?.porcentajeDescuento) || 0;
  const priceToDisplay = product?.precioFinal || product?.precio || 0;
  const precioSinImpuestos = priceToDisplay / 1.21;

  const stockStatus =
    product?.stock === 0
      ? { text: "Sin stock", color: "text-gray-500", bg: "bg-gray-100" }
      : product?.stock <= 10
        ? { text: "Pocas unidades", color: "text-red-500", bg: "bg-red-50" }
        : null;

  const ensureAuth = useCallback(() => {
    if (user) return true;
    setShowLoginModal(true);
    return false;
  }, [setShowLoginModal, user]);

  const handleLoadingAgregar = useCallback(
    async (event) => {
      event.stopPropagation();

      if (!ensureAuth()) return;

      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 800));
      agregarCarrito(product);
      setIsLoading(false);
    },
    [agregarCarrito, ensureAuth, product],
  );

  const handleDisminuir = useCallback(
    (event) => {
      event.stopPropagation();
      if (!ensureAuth()) return;

      if (cantidadEnCarrito === 1) {
        eliminarDelCarrito(product.idProducto);
      } else {
        disminuirCantidad(product.idProducto);
      }
    },
    [
      cantidadEnCarrito,
      disminuirCantidad,
      eliminarDelCarrito,
      ensureAuth,
      product?.idProducto,
    ],
  );

  const handleAumentar = useCallback(
    (event) => {
      event.stopPropagation();
      if (!ensureAuth()) return;
      aumentarCantidad(product.idProducto);
    },
    [aumentarCantidad, ensureAuth, product?.idProducto],
  );

  const handleEliminar = useCallback(
    (event) => {
      event.stopPropagation();
      if (!ensureAuth()) return;
      eliminarDelCarrito(product.idProducto);
    },
    [eliminarDelCarrito, ensureAuth, product?.idProducto],
  );

  return {
    imageLoaded,
    setImageLoaded,
    isLoading,
    principalImage,
    hoverImage,
    cantidadEnCarrito,
    isOffert,
    isPromoDosPorUno,
    isCyberMondayProduct,
    regularPrice,
    discountPercentage,
    priceToDisplay,
    precioSinImpuestos,
    stockStatus,
    handleLoadingAgregar,
    handleDisminuir,
    handleAumentar,
    handleEliminar,
  };
};

export default useCardProductos;
