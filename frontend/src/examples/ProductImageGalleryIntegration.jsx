/*
 * EJEMPLO DE INTEGRACIÓN - ProductImageGallery
 * ============================================
 *
 * Este archivo muestra cómo integrar el componente ProductImageGallery
 * en diferentes partes de tu aplicación.
 */

// ============================================
// 1. PÁGINA DE DETALLE DE PRODUCTO
// ============================================

import { ProductImageGallery } from "@components/molecules/products";
import { useProductDetailStore } from "@store/useProductDetailStore";

export function ProductDetailPage() {
  const { producto, isLoading } = useProductDetailStore();

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* GALERÍA DE IMÁGENES */}
        <ProductImageGallery
          imagenes={producto.imagenes || []}
          nombreProducto={producto.nombreProducto}
          className="w-full sticky top-24"
        />

        {/* INFORMACIÓN DEL PRODUCTO */}
        <div>
          <h1 className="text-3xl font-bold">{producto.nombreProducto}</h1>
          <p className="text-2xl text-green-600 font-bold mt-4">
            ${producto.precio}
          </p>
          <p className="mt-4 text-gray-600">{producto.descripcion}</p>

          {/* Resto de la información */}
        </div>
      </div>
    </div>
  );
}

// ============================================
// 2. CARD DE PRODUCTO (Preview pequeño)
// ============================================

import { useState } from "react";

export function ProductCard({ producto }) {
  const [imagenActual, setImagenActual] = useState(0);
  const imagenes = producto.imagenes || [];

  // Si no hay imágenes, usar el fallback img
  const imagenesAMostrar =
    imagenes.length > 0
      ? imagenes
      : producto.img
        ? [{ urlImagen: producto.img, altText: producto.nombreProducto }]
        : [];

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Mini galería en hover */}
      <div className="relative aspect-square">
        <img
          src={imagenesAMostrar[imagenActual]?.urlImagen}
          alt={producto.nombreProducto}
          className="w-full h-full object-contain"
        />

        {/* Indicadores de múltiples imágenes */}
        {imagenesAMostrar.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {imagenesAMostrar.map((_, index) => (
              <button
                key={index}
                onClick={() => setImagenActual(index)}
                className={`w-2 h-2 rounded-full ${
                  index === imagenActual ? "bg-primary-600" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold">{producto.nombreProducto}</h3>
        <p className="text-green-600 font-bold">${producto.precio}</p>
      </div>
    </div>
  );
}

// ============================================
// 3. ACTUALIZAR STORE PARA INCLUIR IMÁGENES
// ============================================

// useProductDetailStore.js
import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:5000/productos";

export const useProductDetailStore = create((set) => ({
  producto: null,
  isLoading: false,
  error: null,

  fetchProducto: async (id) => {
    set({ isLoading: true, error: null });

    try {
      // Obtener el producto
      const [productoRes, imagenesRes] = await Promise.all([
        axios.get(`${API_URL}/${id}`),
        axios.get(`${API_URL}/${id}/imagenes`),
      ]);

      // Combinar datos
      const producto = {
        ...productoRes.data,
        imagenes: imagenesRes.data,
      };

      set({ producto, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
}));

// ============================================
// 4. PANEL DE ADMINISTRACIÓN - GESTIÓN DE IMÁGENES
// ============================================

import { useState } from "react";
import { Plus, Trash2, Star } from "lucide-react";
import apiClient from "@utils/apiClient";

export function ProductImageManager({ idProducto, imagenes, onUpdate }) {
  const [isUploading, setIsUploading] = useState(false);

  const agregarImagen = async (url) => {
    setIsUploading(true);
    try {
      await apiClient.post(`/productos/${idProducto}/imagenes`, {
        urlImagen: url,
        orden: imagenes.length + 1,
        esPrincipal: imagenes.length === 0,
      });
      onUpdate(); // Recargar imágenes
    } catch (error) {
      console.error("Error al agregar imagen:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const eliminarImagen = async (idImagen) => {
    if (!confirm("¿Eliminar esta imagen?")) return;

    try {
      await apiClient.delete(`/imagenes/${idImagen}`);
      onUpdate();
    } catch (error) {
      console.error("Error al eliminar imagen:", error);
    }
  };

  const marcarPrincipal = async (idImagen) => {
    try {
      await apiClient.patch(`/imagenes/${idImagen}/principal`);
      onUpdate();
    } catch (error) {
      console.error("Error al marcar como principal:", error);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Gestionar Imágenes</h3>

      {/* Grid de imágenes */}
      <div className="grid grid-cols-3 gap-4">
        {imagenes.map((imagen) => (
          <div key={imagen.idImagen} className="relative border rounded-lg p-2">
            <img
              src={imagen.urlImagen}
              alt={imagen.altText}
              className="w-full aspect-square object-contain"
            />

            {/* Badge principal */}
            {imagen.esPrincipal && (
              <div className="absolute top-3 right-3 bg-yellow-500 text-white px-2 py-1 rounded text-xs">
                Principal
              </div>
            )}

            {/* Acciones */}
            <div className="mt-2 flex gap-2">
              {!imagen.esPrincipal && (
                <button
                  onClick={() => marcarPrincipal(imagen.idImagen)}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded text-sm"
                  title="Marcar como principal"
                >
                  <Star className="w-4 h-4 mx-auto" />
                </button>
              )}

              <button
                onClick={() => eliminarImagen(imagen.idImagen)}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white p-2 rounded text-sm"
                disabled={imagenes.length === 1}
                title="Eliminar imagen"
              >
                <Trash2 className="w-4 h-4 mx-auto" />
              </button>
            </div>
          </div>
        ))}

        {/* Botón agregar */}
        <button
          onClick={() => {
            const url = prompt("URL de la imagen:");
            if (url) agregarImagen(url);
          }}
          className="border-2 border-dashed border-gray-300 hover:border-primary-500 rounded-lg aspect-square flex items-center justify-center"
          disabled={isUploading}
        >
          <Plus className="w-8 h-8 text-gray-400" />
        </button>
      </div>
    </div>
  );
}

// ============================================
// 5. EJEMPLO DE REQUEST MANUAL CON FETCH
// ============================================

async function obtenerProductoConImagenes(idProducto) {
  try {
    // Opción 1: Usando el endpoint que ya incluye imágenes
    const response = await fetch(
      `http://localhost:5000/productos/${idProducto}`,
    );
    const producto = await response.json();

    // Si el backend usa findByIdWithOfertasAndImages,
    // producto.imagenes ya vendrá incluido
    console.log("Producto con imágenes:", producto);

    // Opción 2: Obtener imágenes por separado
    const imagenesResponse = await fetch(
      `http://localhost:5000/productos/${idProducto}/imagenes`,
    );
    const imagenes = await imagenesResponse.json();

    return {
      ...producto,
      imagenes,
    };
  } catch (error) {
    console.error("Error:", error);
  }
}

// ============================================
// 6. EJEMPLO DE AGREGAR MÚLTIPLES IMÁGENES
// ============================================

async function agregarImagenesEnBatch(idProducto, urls) {
  const imagenes = urls.map((url, index) => ({
    urlImagen: url,
    orden: index + 1,
    esPrincipal: index === 0,
    altText: `Imagen ${index + 1}`,
  }));

  try {
    const response = await fetch(
      `http://localhost:5000/productos/${idProducto}/imagenes/batch`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tuToken}`,
        },
        body: JSON.stringify({ imagenes }),
      },
    );

    const data = await response.json();
    console.log("Imágenes agregadas:", data);
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
}

// Uso:
agregarImagenesEnBatch(5, [
  "https://example.com/img1.jpg",
  "https://example.com/img2.jpg",
  "https://example.com/img3.jpg",
  "https://example.com/img4.jpg",
]);

// ============================================
// 7. HOOK PERSONALIZADO PARA GESTIÓN DE IMÁGENES
// ============================================

import { useState, useEffect } from "react";
import apiClient from "@utils/apiClient";

export function useProductImages(idProducto) {
  const [imagenes, setImagenes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchImagenes();
  }, [idProducto]);

  const fetchImagenes = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get(`/productos/${idProducto}/imagenes`);
      setImagenes(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const agregarImagen = async (data) => {
    try {
      await apiClient.post(`/productos/${idProducto}/imagenes`, data);
      await fetchImagenes(); // Recargar
    } catch (err) {
      throw new Error(err.message);
    }
  };

  const eliminarImagen = async (idImagen) => {
    try {
      await apiClient.delete(`/imagenes/${idImagen}`);
      await fetchImagenes();
    } catch (err) {
      throw new Error(err.message);
    }
  };

  const setPrincipal = async (idImagen) => {
    try {
      await apiClient.patch(`/imagenes/${idImagen}/principal`);
      await fetchImagenes();
    } catch (err) {
      throw new Error(err.message);
    }
  };

  return {
    imagenes,
    isLoading,
    error,
    agregarImagen,
    eliminarImagen,
    setPrincipal,
    refresh: fetchImagenes,
  };
}

// Uso del hook:
function MiComponente() {
  const { imagenes, isLoading, agregarImagen } = useProductImages(5);

  if (isLoading) return <div>Cargando...</div>;

  return (
    <div>
      <ProductImageGallery imagenes={imagenes} />
      <button
        onClick={() =>
          agregarImagen({
            urlImagen: "https://...",
            orden: imagenes.length + 1,
          })
        }
      >
        Agregar Imagen
      </button>
    </div>
  );
}

// ============================================
// NOTAS FINALES
// ============================================

/*
 * COMPATIBILIDAD:
 * - Si producto.imagenes existe y tiene elementos, úsalo
 * - Si no, usa producto.img como fallback
 * - El backend automáticamente maneja esta lógica con las funciones *WithImages
 *
 * MEJORES PRÁCTICAS:
 * - Siempre valida que imagenes sea un array: producto.imagenes || []
 * - Usa el componente ProductImageGallery para consistencia visual
 * - Implementa lazy loading en listas grandes
 * - Comprime imágenes antes de subirlas
 * - Considera usar un CDN para las imágenes
 *
 * OPTIMIZACIÓN:
 * - Las imágenes se cargan con lazy loading automático
 * - El componente maneja estados de carga y error
 * - Los índices en la BD optimizan las consultas
 */
