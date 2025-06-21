import axios from 'axios';
import { useEffect } from 'react';

const Productos = () => {

  const getProductos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/productos');
      console.log(response.data);
    } catch (error) {
      console.error('Error al obtener productos:', error);
    }
  }

  useEffect(() => {
    getProductos();
  }, []);

  return (
    <div>Productos</div>
  );
}

export default Productos;
