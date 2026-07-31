import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "@utils/apiClient";
import Default from "@assets/default.webp";
import { useCarritoStore } from "@store/useCarritoStore";
import { useModalLock } from "@hooks/useModalLock";
import { getProductSubtotal } from "../utils/cartModalHelpers";

const useCartModal = () => {
  const navigate = useNavigate();

  const carrito = useCarritoStore((state) => state.carrito);
  const isCartModalOpen = useCarritoStore((state) => state.isCartModalOpen);
  const setIsCartModalOpen = useCarritoStore(
    (state) => state.setIsCartModalOpen,
  );
  const eliminarDelCarrito = useCarritoStore(
    (state) => state.eliminarDelCarrito,
  );
  const disminuirCantidad = useCarritoStore((state) => state.disminuirCantidad);
  const aumentarCantidad = useCarritoStore((state) => state.aumentarCantidad);
  const vaciarCarrito = useCarritoStore((state) => state.vaciarCarrito);
  const sincronizarCarrito = useCarritoStore(
    (state) => state.sincronizarCarrito,
  );

  const [imagenesPrincipales, setImagenesPrincipales] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [showEmptyCartModal, setShowEmptyCartModal] = useState(false);

  useEffect(() => {
    if (!isCartModalOpen) return;
    sincronizarCarrito();
  }, [isCartModalOpen, sincronizarCarrito]);

  useEffect(() => {
    if (!isCartModalOpen || carrito.length === 0) return;

    let isMounted = true;

    const fetchImages = async () => {
      const imagesByProduct = {};

      await Promise.all(
        carrito.map(async (prod) => {
          try {
            const response = await apiClient.get(
              `/productos/${prod.idProducto}/imagenes/principal`,
            );
            imagesByProduct[prod.idProducto] =
              response.data?.urlImagen || prod.img || Default;
          } catch {
            imagesByProduct[prod.idProducto] = prod.img || Default;
          }
        }),
      );

      if (isMounted) {
        setImagenesPrincipales(imagesByProduct);
      }
    };

    fetchImages();

    return () => {
      isMounted = false;
    };
  }, [carrito, isCartModalOpen]);

  useEffect(() => {
    if (!isCartModalOpen) return undefined;

    const handleEsc = (event) => {
      if (event.key === "Escape") {
        setIsCartModalOpen(false);
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isCartModalOpen, setIsCartModalOpen]);

  useModalLock(isCartModalOpen);

  const subtotal = useMemo(
    () =>
      carrito.reduce((acc, product) => acc + getProductSubtotal(product), 0),
    [carrito],
  );

  const totalItems = useMemo(
    () => carrito.reduce((acc, item) => acc + (item.cantidad || 0), 0),
    [carrito],
  );

  const closeModal = useCallback(() => {
    setIsCartModalOpen(false);
  }, [setIsCartModalOpen]);

  const goToProducts = useCallback(() => {
    setIsCartModalOpen(false);
    navigate("/productos");
  }, [navigate, setIsCartModalOpen]);

  const handleCheckout = useCallback(() => {
    setIsCartModalOpen(false);
    navigate("/checkout");
  }, [navigate, setIsCartModalOpen]);

  const openDeleteConfirm = useCallback((productId) => {
    setProductToDelete(productId);
    setShowDeleteModal(true);
  }, []);

  const closeDeleteConfirm = useCallback(() => {
    setShowDeleteModal(false);
    setProductToDelete(null);
  }, []);

  const confirmDelete = useCallback(() => {
    if (productToDelete == null) return;
    eliminarDelCarrito(productToDelete);
    closeDeleteConfirm();
  }, [closeDeleteConfirm, eliminarDelCarrito, productToDelete]);

  const confirmEmptyCart = useCallback(() => {
    vaciarCarrito();
    setShowEmptyCartModal(false);
  }, [vaciarCarrito]);

  const decreaseQuantity = useCallback(
    (productId) => {
      disminuirCantidad(productId);
    },
    [disminuirCantidad],
  );

  const increaseQuantity = useCallback(
    (productId) => {
      aumentarCantidad(productId);
    },
    [aumentarCantidad],
  );

  return {
    carrito,
    imagenesPrincipales,
    isCartModalOpen,
    showDeleteModal,
    showEmptyCartModal,
    subtotal,
    totalItems,
    closeModal,
    closeDeleteConfirm,
    confirmDelete,
    confirmEmptyCart,
    decreaseQuantity,
    goToProducts,
    handleCheckout,
    increaseQuantity,
    openDeleteConfirm,
    setShowEmptyCartModal,
  };
};

export default useCartModal;
