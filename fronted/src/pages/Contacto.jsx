import { useState } from 'react';

const Contacto = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    mensaje: ''
  });

  const [mensajeEnviado, setMensajeEnviado] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMensajeEnviado(true);
    setFormData({ nombre: '', email: '', mensaje: '' });
    setTimeout(() => setMensajeEnviado(false), 3000);
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-semibold text-green-600">Contacto</h2>
        <p className="mt-2 text-gray-700">
          📧{' '}
          <a href="mailto:contacto@pixelsalud.com" className="text-green-600 hover:underline">
            contacto@pixelsalud.com
          </a>
        </p>
        <p className="text-gray-700">
          🌐{' '}
          <a href="https://www.pixelsalud.com" className="text-green-600 hover:underline">
            www.pixelsalud.com
          </a>
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-6 rounded-xl shadow-md space-y-4"
      >
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Correo electrónico
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label htmlFor="mensaje" className="block text-sm font-medium text-gray-700 mb-1">
            Mensaje
          </label>
          <textarea
            id="mensaje"
            name="mensaje"
            rows="4"
            value={formData.mensaje}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 resize-y"
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-green-700 transition"
        >
          Enviar mensaje
        </button>

        {mensajeEnviado && (
          <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-md text-sm font-medium">
            ¡Gracias por contactarnos! Te responderemos a la brevedad.
          </div>
        )}
      </form>
    </div>
  );
};

export default Contacto;
