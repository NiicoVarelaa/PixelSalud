import { useCarritoStore } from "../store/useCarritoStore";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import CardCompra from "./CardCompra";

const MainCarrito = () => {
  const { carrito, eliminarDelCarrito, disminuirCantidad, aumentarCantidad } =
    useCarritoStore();
    
  console.log(carrito);
  
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Estas seguro de eliminar este producto de tu carrito?",
      showDenyButton: true,
      confirmButtonText: "Si",
      denyButtonText: `No`,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Producto eliminado correctamente!", "", "success");
        eliminarDelCarrito(id);
      }
    });
  };

  return (
    <>
      {carrito.length === 0 ? (
        <>
          <h2 className="text-center">No tienes productos en tu carrtio.</h2>
          <br />
          <img
            src="https://static.vecteezy.com/system/resources/previews/010/883/288/non_2x/cute-sad-pill-with-wrong-sign-cartoon-character-free-png.png"
            alt=""
            className="w-100 mx-auto"
          />
        
          <button className="group cursor-pointer flex items-center mt-8 gap-2 text-indigo-500 font-medium">
            <svg
              width="15"
              height="11"
              viewBox="0 0 15 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.09 5.5H1M6.143 10 1 5.5 6.143 1"
                stroke="#615fff"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <Link to="/productos">Ver productos</Link>
          </button>
        </>
      ) : (
       <div className="flex flex-col md:flex-row py-16 max-w-6xl w-full px-6 mx-auto gap-10 items-start">
          <div className="flex-1 max-w-4xl">
            <h1 className="text-3xl font-medium mb-6">Tu Carrito 🛒</h1>

            <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-lg font-medium pb-3">
              <p className="text-left">Productos</p>
              <p className="text-center">Precio</p>
            </div>

            {carrito.map((product) => (
              <div
                key={product.idProducto}
                 className="grid grid-cols-[2fr_1fr_1fr] items-center text-sm md:text-base font-medium pt-3 mb-4 bg-white p-4 rounded-xl shadow-sm"
              >
                <div className="flex items-center md:gap-6 gap-3">
                  <div className=" w-50 h-50 flex items-center justify-center ">
                    <img
                      className="max-w-full h-full object-cover"
                      src={product.img}
                      alt={product.nombreProducto}
                    />
                  </div>
                  <div>
                    <p className="hidden md:block font-semibold">
                      {product.nombreProducto}
                    </p>
                    <div className="font-normal text-gray-500/70">
                      <p>Cantidad:</p>
                      <div className="flex items-center">
                        <button
                         className="w-7 h-7 flex items-center justify-center rounded-full border hover:text-white hover:bg-red-500 border-red-500 text-red-600 text-sm transition"
                          onClick={() =>
                            product.cantidad > 1 &&
                            disminuirCantidad(product.idProducto)
                          }
                        >
                          -
                        </button>
                        <div className="mx-2">{product.cantidad}</div>
                        <button
                          className="w-7 h-7 flex items-center justify-center rounded-full border hover:text-white hover:bg-green-500 border-green-500 text-green-600 text-sm transition"
                          onClick={() =>
                            product.stock > product.cantidad &&
                            aumentarCantidad(product.idProducto)
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-center">$ {product.precio}</p>
                <button
                  className="cursor-pointer mx-auto"
                  onClick={() => handleDelete(product.idProducto)}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="m12.5 7.5-5 5m0-5 5 5m5.833-2.5a8.333 8.333 0 1 1-16.667 0 8.333 8.333 0 0 1 16.667 0"
                      stroke="#FF532E"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            ))}

            <button className="group cursor-pointer flex items-center mt-8 gap-2 text-indigo-500 font-medium">
              <svg
                width="15"
                height="11"
                viewBox="0 0 15 11"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14.09 5.5H1M6.143 10 1 5.5 6.143 1"
                  stroke="#615fff"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <Link to="/productos">Ver otros productos</Link>
            </button>
          </div>
          <CardCompra/>
        </div>
      )}
    </>
  );
};

export default MainCarrito;
