import { useEffect, useState } from "react";
import {  useParams } from "react-router-dom";
import axios from "axios";
import { useCarritoStore } from "../store/useCarritoStore";
import ModalCompra from "../components/ModalCompra";
import Footer from "../components/Footer";
import Header from "../components/Header";



const Producto = () => {
   const {agregarCarrito} = useCarritoStore()
   

  const [producto, setProducto] = useState([]);
  const { id } = useParams();

  const getProducto = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/productos/${id}`);
      setProducto(response.data);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  };

 

  useEffect(() => {
    getProducto();
  }, []);
  return (
    <>
    <Header/>
     <div className="max-w-6xl w-full px-6">
      <br />
      <br />
      <div className="flex flex-col md:flex-row gap-16 mt-4">
        <div className="flex gap-3">
          <div className="border border-gray-500/30 max-w-100 rounded overflow-hidden">
          <img src={producto.img} alt={producto.descripcion}/>

          </div>
        </div>

        <div className="text-sm w-full md:w-1/2">
          <h1 className="text-3xl font-medium">{producto.nombreProducto} </h1>

          <div className="mt-6">
            <p className="text-2xl font-medium">Precio: ${producto.precio} </p>
            
          </div>

          <p className="text-base font-medium mt-6">Descripcion </p>
          <p className="list-disc ml-4 text-gray-500/70">
            {producto.descripcion}
          </p>

          <div className="flex items-center mt-10 gap-4 text-base">
            
            <button className="w-full py-3.5 cursor-pointer font-medium bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition" onClick={()=>agregarCarrito(producto)}>
              Agregar a carrito
            </button>
            <ModalCompra {...producto} />
          </div>
          
        </div>
      </div>
      
    </div>
    <Footer/>
    </>
   
  );
};

export default Producto;