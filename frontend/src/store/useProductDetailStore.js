import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useProductStore } from '../store/useProductStore';

const API_URL = "http://localhost:5000/productos";

export const useProductDetailStore = () => {
  const { id } = useParams();
  const { productos, fetchProductos } = useProductStore();

  const [producto, setProducto] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [precioOriginal, setPrecioOriginal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getProducto = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${API_URL}/${id}`);
        const data = res.data;

        setProducto(data);

        // Lógica de precio más clara y estándar
        const discountPercentage = 0.20; // 20% OFF
        const precioFinal = data.precio;
        const precioOriginalCalculado = precioFinal / (1 - discountPercentage);
        setPrecioOriginal(precioOriginalCalculado);
        
        // Si el store de productos está vacío, lo llenamos.
        if (productos.length === 0) {
          fetchProductos(); 
        }

      } catch (err) {
        console.error("Error al obtener el producto:", err);
        setError("No pudimos encontrar el producto que buscas.");
      } finally {
        setIsLoading(false);
      }
    };

    getProducto();
  }, [id, productos.length, fetchProductos]); // Dependencias actualizadas

  // Efecto para encontrar productos relacionados (mucho más eficiente)
  useEffect(() => {
    if (producto && productos.length > 0) {
      const sameCategory = productos.filter(p => 
        p.categoria === producto.categoria && p.idProducto !== producto.idProducto
      );
      const shuffled = [...sameCategory].sort(() => 0.5 - Math.random());
      setRelatedProducts(shuffled.slice(0, 8)); // Traemos más para la grilla
    }
  }, [producto, productos]);

  return { producto, relatedProducts, precioOriginal, isLoading, error };
};