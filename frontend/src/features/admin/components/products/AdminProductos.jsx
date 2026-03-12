import { useProductStore } from "@store/useProductStore";
import { useAuthStore } from "@store/useAuthStore";
import { useState, useMemo, useCallback } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AdminLayout } from "@features/admin/components/shared";
import ProductFilters from "./components/ProductFilters";
import Pagination from "./components/Pagination";
import ProductCard from "./components/ProductCard";
import ProductTable from "./components/ProductTable";
import CreateProductModal from "./components/CreateProductModal";
import UploadImagesModal from "./components/UploadImagesModal";
import EditProductModal from "./components/EditProductModal";
import ToggleStatusModal from "./components/ToggleStatusModal";
import EmptyState from "./components/EmptyState";

// Custom Hooks
import {
  useProductFilters,
  usePagination,
  useProductModals,
  useIsMobile,
} from "./hooks";

// Utils
import {
  ENDPOINTS,
  ITEMS_PER_PAGE,
  filterValidCategories,
  formatPrice,
} from "./utils/productUtils";

const AdminProductos = () => {
  // ==================== STORES Y HOOKS ====================
  const productos = useProductStore((state) => state.productos);
  const fetchProducts = useProductStore((state) => state.fetchProducts);
  const categorias = useProductStore((state) => state.categorias);
  const token = useAuthStore((state) => state.token);

  const {
    busqueda,
    filtroCategoria,
    filtroEstado,
    productosFiltrados,
    handleBusquedaChange,
    handleCategoriaChange,
    handleEstadoChange,
  } = useProductFilters(productos);

  const { currentPage, totalPages, paginatedItems, goToPage } = usePagination(
    productosFiltrados,
    ITEMS_PER_PAGE,
  );

  const {
    isCreateModalOpen,
    createStep,
    createdProductId,
    openCreateModal,
    closeCreateModal,
    goToImagesStep,
  } = useProductModals();

  const isMobile = useIsMobile();

  const [editingProduct, setEditingProduct] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [toggleProduct, setToggleProduct] = useState(null);
  const [isToggleModalOpen, setIsToggleModalOpen] = useState(false);

  const [nuevoProducto, setNuevoProducto] = useState({
    nombreProducto: "",
    descripcion: "",
    precio: "",
    categoria: "",
    stock: "",
  });

  const axiosConfig = useMemo(
    () => ({
      headers: {
        Auth: `Bearer ${token}`,
      },
    }),
    [token],
  );

  const categoriasPermitidas = useMemo(
    () => filterValidCategories(categorias),
    [categorias],
  );

  // ==================== CALLBACKS ====================
  const handleEditarProducto = useCallback((prod) => {
    setEditingProduct(prod);
    setIsEditModalOpen(true);
  }, []);

  const handleSaveProduct = useCallback(
    async (formData) => {
      try {
        await axios.put(
          ENDPOINTS.PRODUCTOS.UPDATE(editingProduct.idProducto),
          {
            ...formData,
            activo: editingProduct.activo,
          },
          axiosConfig,
        );

        toast.success("Producto actualizado correctamente");
        setIsEditModalOpen(false);
        setEditingProduct(null);
        fetchProducts();
      } catch (error) {
        console.error("Error editando:", error);
        toast.error("No se pudo actualizar el producto");
      }
    },
    [editingProduct, axiosConfig, fetchProducts],
  );

  const handleCloseEditModal = useCallback(() => {
    setIsEditModalOpen(false);
    setEditingProduct(null);
  }, []);

  const handleUpdateImagesFromEdit = useCallback(() => {
    toast.success("¡Imágenes actualizadas!");
    fetchProducts();
  }, [fetchProducts]);

  const agregarProducto = useCallback(async () => {
    try {
      const productoAEnviar = {
        ...nuevoProducto,
        precio: Number(nuevoProducto.precio) || 0,
        img: "https://placehold.co/400x400/e5e7eb/6b7280?text=Sin+Imagen",
      };

      const response = await axios.post(
        ENDPOINTS.PRODUCTOS.CREATE,
        productoAEnviar,
        axiosConfig,
      );

      const idNuevoProducto = response.data.producto?.idProducto;

      if (!idNuevoProducto) {
        console.error("No se recibió idProducto del backend:", response.data);
        toast.error("Error: No se pudo obtener el ID del producto");
        return;
      }

      goToImagesStep(idNuevoProducto);
      toast.success("Producto creado! Ahora sube las imágenes");
    } catch (error) {
      console.error("Error al agregar producto:", error);
      toast.error("Error al agregar el producto");
    }
  }, [nuevoProducto, axiosConfig, goToImagesStep]);

  const handleImagenesSubidas = useCallback(() => {
    toast.success("¡Imágenes subidas exitosamente!");
    closeCreateModal();
    setNuevoProducto({
      nombreProducto: "",
      descripcion: "",
      precio: "",
      categoria: "",
      stock: "",
    });
    fetchProducts();
  }, [closeCreateModal, fetchProducts]);

  const cerrarModalCreacion = useCallback(() => {
    closeCreateModal();
    setNuevoProducto({
      nombreProducto: "",
      descripcion: "",
      precio: "",
      categoria: "",
      stock: "",
    });
  }, [closeCreateModal]);

  const handleToggleActiva = useCallback((prod) => {
    setToggleProduct(prod);
    setIsToggleModalOpen(true);
  }, []);

  const handleConfirmToggle = useCallback(async () => {
    if (!toggleProduct) return;

    const participio = toggleProduct.activo ? "desactivado" : "activado";

    try {
      await axios.put(
        ENDPOINTS.PRODUCTOS.TOGGLE_ACTIVE(toggleProduct.idProducto),
        { activo: !toggleProduct.activo },
        axiosConfig,
      );

      toast.success(`Producto ${participio} correctamente`, {
        position: "top-right",
      });
      fetchProducts();
    } catch (error) {
      console.error("Error estado:", error);
      toast.error("No se pudo cambiar el estado del producto");
    }
  }, [toggleProduct, axiosConfig, fetchProducts]);

  const handleCloseToggleModal = useCallback(() => {
    setIsToggleModalOpen(false);
    setToggleProduct(null);
  }, []);

  // ==================== RENDER CON LAYOUT CORREGIDO ====================

  return (
    <AdminLayout
      title="Gestión de Productos"
      description={`${productosFiltrados.length} producto${productosFiltrados.length !== 1 ? "s" : ""} encontrado${productosFiltrados.length !== 1 ? "s" : ""}`}
    >
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      {/* FILTROS */}
      <div className="mb-2 shrink-0">
        <ProductFilters
          busqueda={busqueda}
          onBusquedaChange={handleBusquedaChange}
          filtroCategoria={filtroCategoria}
          onCategoriaChange={handleCategoriaChange}
          filtroEstado={filtroEstado}
          onEstadoChange={handleEstadoChange}
          categorias={categoriasPermitidas}
          onAddProduct={openCreateModal}
        />
      </div>

      {/* TABLA DE PRODUCTOS */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {!isMobile ? (
          <ProductTable
            products={paginatedItems}
            onEdit={handleEditarProducto}
            onToggleActive={handleToggleActiva}
            formatPrice={formatPrice}
          />
        ) : (
          <div className="space-y-2.5">
            {paginatedItems.length > 0 ? (
              paginatedItems.map((prod) => (
                <ProductCard
                  key={prod.idProducto}
                  product={prod}
                  onEdit={handleEditarProducto}
                  onToggleActive={handleToggleActiva}
                  formatPrice={formatPrice}
                />
              ))
            ) : (
              <EmptyState />
            )}
          </div>
        )}
      </div>

      {/* PAGINACIÓN */}
      {productosFiltrados.length > 0 && (
        <div className="mt-3 shrink-0">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
          />
        </div>
      )}

      {/* Modales */}
      <CreateProductModal
        isOpen={isCreateModalOpen && createStep === 1}
        onClose={cerrarModalCreacion}
        nuevoProducto={nuevoProducto}
        setNuevoProducto={setNuevoProducto}
        onSubmit={agregarProducto}
        categorias={categoriasPermitidas}
      />

      <UploadImagesModal
        isOpen={isCreateModalOpen && createStep === 2}
        onClose={cerrarModalCreacion}
        productId={createdProductId}
        onUploadSuccess={handleImagenesSubidas}
      />

      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        product={editingProduct}
        onSave={handleSaveProduct}
        categorias={categoriasPermitidas}
        onUpdateImages={handleUpdateImagesFromEdit}
      />

      <ToggleStatusModal
        isOpen={isToggleModalOpen}
        onClose={handleCloseToggleModal}
        product={toggleProduct}
        onConfirm={handleConfirmToggle}
      />
    </AdminLayout>
  );
};

export default AdminProductos;
