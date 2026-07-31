import { useState, useEffect, useCallback } from "react";
import apiClient from "@utils/apiClient";
import { useAuthStore } from "@store/useAuthStore";
import { Plus, Package, AlertCircle, X } from "lucide-react";
import PaginationProductos from "@features/admin/components/products/components/Pagination";
import CreateProductModal from "@features/admin/components/products/components/CreateProductModal";
import EditProductModal from "@features/admin/components/products/components/EditProductModal";
import ToggleStatusModal from "@features/admin/components/products/components/ToggleStatusModal";
import Skeleton from "./panels/ProductsSkeleton";
import EmptyState from "./panels/ProductsEmptyState";
import ProductSearchBar from "./panels/ProductSearchBar";
import ProductsTable from "./panels/ProductsTable";
import { ITEMS_POR_PAGINA, CATEGORIAS } from "./utils/productos.utils";

const EmpleadoProductos = () => {
  const { user } = useAuthStore();
  const permisos = user?.permisos || {};
  const modificarPermiso = permisos.modificar_productos;

  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [mutationLoading, setMutationLoading] = useState(false);
  const [mutationError, setMutationError] = useState("");

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [nuevoProducto, setNuevoProducto] = useState({
    nombreProducto: "",
    categoria: "",
    precio: "",
    stock: "",
    descripcion: "",
  });

  const [editingProduct, setEditingProduct] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [toggleProduct, setToggleProduct] = useState(null);
  const [isToggleOpen, setIsToggleOpen] = useState(false);

  const cargarInventario = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/productos");
      setProductos(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { cargarInventario(); }, [cargarInventario]);

  const openCreateModal = () => {
    setNuevoProducto({ nombreProducto: "", categoria: "", precio: "", stock: "", descripcion: "" });
    setMutationError("");
    setIsCreateOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateOpen(false);
    setNuevoProducto({ nombreProducto: "", categoria: "", precio: "", stock: "", descripcion: "" });
    setMutationError("");
  };

  const handleCrearProducto = async () => {
    setMutationLoading(true);
    setMutationError("");
    try {
      const data = {
        ...nuevoProducto,
        precio: Number(nuevoProducto.precio),
        stock: Number(nuevoProducto.stock) || 0,
      };
      await apiClient.post("/productos/crear", data);
      closeCreateModal();
      cargarInventario();
    } catch (error) {
      setMutationError(error.response?.data?.message || "Error al crear el producto");
    } finally {
      setMutationLoading(false);
    }
  };

  const openEditModal = (prod) => {
    setEditingProduct(prod);
    setMutationError("");
    setIsEditOpen(true);
  };

  const closeEditModal = () => {
    setIsEditOpen(false);
    setEditingProduct(null);
    setMutationError("");
  };

  const handleSaveEdit = async (formData) => {
    setMutationLoading(true);
    setMutationError("");
    try {
      await apiClient.put(`/productos/actualizar/${editingProduct.idProducto}`, formData);
      closeEditModal();
      cargarInventario();
    } catch (error) {
      setMutationError(error.response?.data?.message || "Error al editar el producto");
    } finally {
      setMutationLoading(false);
    }
  };

  const handleUpdateImages = () => {
    cargarInventario();
  };

  const openToggleModal = (prod) => {
    setToggleProduct(prod);
    setMutationError("");
    setIsToggleOpen(true);
  };

  const closeToggleModal = () => {
    setIsToggleOpen(false);
    setToggleProduct(null);
    setMutationError("");
  };

  const handleConfirmToggle = async () => {
    if (!toggleProduct) return;
    setMutationLoading(true);
    setMutationError("");
    try {
      const esActivo = toggleProduct.activo === 1 || toggleProduct.activo === true;
      const endpoint = esActivo
        ? `/productos/darBaja/${toggleProduct.idProducto}`
        : `/productos/activar/${toggleProduct.idProducto}`;
      await apiClient.put(endpoint);
      closeToggleModal();
      cargarInventario();
    } catch (error) {
      setMutationError(error.response?.data?.message || "Error al cambiar el estado del producto");
    } finally {
      setMutationLoading(false);
    }
  };

  useEffect(() => { setPaginaActual(1); }, [busqueda]);

  const productosFiltrados = productos.filter((p) => {
    if (!busqueda) return true;
    const t = busqueda.toLowerCase();
    const estadoTexto = p.activo ? "activo" : "inactivo";
    return (
      (p.nombreProducto || "").toLowerCase().includes(t) ||
      (p.categoria || "").toLowerCase().includes(t) ||
      estadoTexto.includes(t) ||
      String(p.stock ?? "").includes(t)
    );
  });

  const totalPaginas = Math.max(1, Math.ceil(productosFiltrados.length / ITEMS_POR_PAGINA));
  const inicio = (paginaActual - 1) * ITEMS_POR_PAGINA;
  const productosPaginados = productosFiltrados.slice(inicio, inicio + ITEMS_POR_PAGINA);

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      {mutationError && (
        <div className="mb-4 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <AlertCircle size={18} className="text-red-600 shrink-0" />
          <p className="flex-1 text-sm font-medium text-red-800">{mutationError}</p>
          <button
            type="button"
            onClick={() => setMutationError("")}
            className="text-red-400 hover:text-red-600 transition-colors cursor-pointer"
            aria-label="Cerrar notificación"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50">
            <Package size={18} className="text-amber-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Productos</h1>
            <p className="text-xs text-gray-400">
              {productosFiltrados.length} producto{productosFiltrados.length !== 1 ? "s" : ""} en inventario
            </p>
          </div>
        </div>

        {permisos.crear_productos && (
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 self-start rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-green-600/20 transition-all hover:bg-green-700 hover:shadow-green-600/30 active:scale-95 cursor-pointer"
          >
            <Plus size={17} />
            Nuevo producto
          </button>
        )}
      </div>

      <ProductSearchBar value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />

      <div className="flex-1 min-h-0">
        {loading ? (
          <Skeleton />
        ) : productosFiltrados.length === 0 ? (
          <EmptyState search={busqueda} />
        ) : (
          <ProductsTable
            productosPaginados={productosPaginados}
            modificarPermiso={modificarPermiso}
            onEdit={openEditModal}
            onToggle={openToggleModal}
          />
        )}
      </div>

      {!loading && productosFiltrados.length > 0 && (
        <div className="mt-4 shrink-0">
          <PaginationProductos
            currentPage={paginaActual}
            totalPages={totalPaginas}
            onPageChange={setPaginaActual}
          />
        </div>
      )}

      <CreateProductModal
        isOpen={isCreateOpen}
        onClose={closeCreateModal}
        nuevoProducto={nuevoProducto}
        setNuevoProducto={setNuevoProducto}
        onSubmit={handleCrearProducto}
        categorias={CATEGORIAS}
        loading={mutationLoading}
        error={mutationError}
      />

      <EditProductModal
        isOpen={isEditOpen}
        onClose={closeEditModal}
        product={editingProduct}
        onSave={handleSaveEdit}
        categorias={CATEGORIAS}
        onUpdateImages={handleUpdateImages}
        loading={mutationLoading}
        error={mutationError}
      />

      <ToggleStatusModal
        isOpen={isToggleOpen}
        onClose={closeToggleModal}
        product={toggleProduct}
        onConfirm={handleConfirmToggle}
        loading={mutationLoading}
        error={mutationError}
      />
    </div>
  );
};

export default EmpleadoProductos;
