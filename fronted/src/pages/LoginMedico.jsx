import React, { useState } from "react";
import axios from "axios";

const LoginMedico = () => {
  const [form, setForm] = useState({
    email: "",
    contraMedico: "",
    matricula: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/loginMedico", form);
      alert(`Login exitoso, bienvenido ${res.data.nombre}`);
      // Aquí podés redirigir o guardar token/localstorage, etc.
    } catch (error) {
      if (error.response) {
        alert(error.response.data.error);
      } else {
        alert("Error al conectar con el servidor");
      }
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-green-600">
          Login Médico
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            name="matricula"
            placeholder="Matrícula"
            value={form.matricula}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            required
            type="number"
          />
          <input
            type="password"
            name="contraMedico"
            placeholder="Contraseña"
            value={form.contraMedico}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition duration-300"
          >
            Loguear
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginMedico;
