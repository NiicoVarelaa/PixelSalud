import React, { useState } from "react";
import axios from "axios";

const Registro = () => {
  const [form, setForm] = useState({
    nombreCliente: "",
    apellidoCliente: "",
    email: "",
    contraCliente: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/registroCliente", form);
      alert(res.data.mensaje);
      setForm({
        nombreCliente: "",
        apellidoCliente: "",
        email: "",
        contraCliente: "",
      });
    } catch (error) {
      alert("Error al registrar el cliente");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-green-600">
          Registro 
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="nombreCliente"
            placeholder="Nombre"
            value={form.nombreCliente}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
          <input
            name="apellidoCliente"
            placeholder="Apellido"
            value={form.apellidoCliente}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
          <input
            type="password"
            name="contraCliente"
            placeholder="Contraseña"
            value={form.contraCliente}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition duration-300"
          >
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
};

export default Registro;

