import { useState } from "react";
import Swal from "sweetalert2";


const ModalCompra = () => {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [metodoPago, setMetodoPago] = useState("");

  const abrirModal = () => {
    setMostrarModal(true);
    setMetodoPago("");
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setMetodoPago("");
  };

  const handlePago = (e) => {
    e.preventDefault();
    Swal.fire("Pago exitoso", "Tu compra ha sido procesada", "success");
    cerrarModal();
  };

  return (
    <>
      <button
        onClick={abrirModal}
        className="w-full py-3.5 cursor-pointer font-medium bg-green-500 text-white hover:bg-green-600 transition"
      >
        Comprar
      </button>

      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl relative">
            <h2 className="text-xl font-bold mb-4 text-center">Selecciona una forma de pago</h2>

            <div className="flex flex-col gap-3 mb-4">
              <button
                onClick={() => setMetodoPago("debito")}
                className={`border px-4 py-2 rounded ${
                  metodoPago === "debito" ? "bg-green-100" : ""
                }`}
              >
                Tarjeta de Débito
              </button>
              <button
                onClick={() => setMetodoPago("credito")}
                className={`border px-4 py-2 rounded ${
                  metodoPago === "credito" ? "bg-green-100" : ""
                }`}
              >
                Tarjeta de Crédito
              </button>
            </div>

            {metodoPago && (
              <form onSubmit={handlePago} className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Nombre en la tarjeta"
                  required
                  className="border rounded px-3 py-2"
                />
                <input
                  type="text"
                  placeholder="Número de tarjeta"
                  required
                  className="border rounded px-3 py-2"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="MM/AA"
                    required
                    className="border rounded px-3 py-2 w-1/2"
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    required
                    className="border rounded px-3 py-2 w-1/2"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3.5 cursor-pointer font-medium bg-green-500 text-white hover:bg-green-600 transition"
                >
                  Confirmar pago con {metodoPago}
                </button>
              </form>
            )}

            <button
              onClick={cerrarModal}
              className="absolute top-2 right-3 text-gray-500 hover:text-red-600 text-xl"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      
    </>
    
  );
}

export default ModalCompra