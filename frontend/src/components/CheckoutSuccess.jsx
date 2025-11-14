import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCarritoStore } from '../store/useCarritoStore';
import { FiCheckCircle, FiLoader } from 'react-icons/fi';

const CheckoutSuccess = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const vaciarCarritoLocal = useCarritoStore(state => state.vaciarCarrito);
    const [countdown, setCountdown] = useState(3);

    const LOCAL_SUCCESS_URL = 'http://localhost:5173/perfil/mis-compras';

    useEffect(() => {
        // Limpiar el carrito localmente (Zustand)
        vaciarCarritoLocal();

        // Obtener parámetros de MercadoPago
        const paymentId = searchParams.get('payment_id');
        const status = searchParams.get('status');
        const externalReference = searchParams.get('external_reference');

        console.log('✅ Pago completado:', { paymentId, status, externalReference });

        // Contador regresivo con navegación
        let currentCount = 3;
        const timer = setInterval(() => {
            currentCount -= 1;
            setCountdown(currentCount);
            
            if (currentCount <= 0) {
                clearInterval(timer);
                window.location.replace(LOCAL_SUCCESS_URL);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, []); // Dependencias vacías - solo se ejecuta una vez

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-primary-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
                {/* Ícono animado */}
                <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
                    <FiCheckCircle className="w-12 h-12 text-green-600" />
                </div>

                {/* Título */}
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    ¡Pago Exitoso!
                </h1>

                {/* Mensaje */}
                <p className="text-gray-600 mb-6">
                    Tu compra ha sido procesada correctamente. El pedido está listo para ser retirado en nuestra tienda.
                </p>

                {/* Información adicional */}
                <div className="bg-primary-50 rounded-lg p-4 mb-6">
                    <p className="text-sm text-gray-700">
                        <span className="font-semibold">✨ Importante:</span> Recibirás un correo de confirmación con los detalles de tu pedido.
                    </p>
                </div>

                {/* Contador */}
                <div className="flex items-center justify-center gap-2 text-gray-600">
                    <FiLoader className="animate-spin" />
                    <p className="text-sm">
                        Redirigiendo a tus compras en <span className="font-bold text-primary-600">{countdown}</span> segundos...
                    </p>
                </div>

                {/* Botón manual */}
                <button
                    onClick={() => navigate('/perfil/mis-compras', { replace: true })}
                    className="mt-6 w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                >
                    Ver mis compras ahora
                </button>
            </div>
        </div>
    );
};

export default CheckoutSuccess;