import React, { useState } from "react";
import axios from "axios";

const RegistroMedico = () => {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    especialidad: "",
    matricula: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/registroMedico",
        {
          nombre: form.nombre,
          apellido: form.apellido,
          email: form.email,
          especialidad: form.especialidad,
          matricula: form.matricula,
          password: form.password,
        }
      );

      alert("Registro exitoso del médico");
      console.log("Registro exitoso:", response.data);
      // Limpiar formulario o redirigir si querés
      setForm({
        nombre: "",
        apellido: "",
        email: "",
        especialidad: "",
        matricula: "",
        password: "",
      });
    } catch (error) {
      if (error.response) {
        alert("Error: " + error.response.data.error);
      } else {
        alert("No se pudo conectar con el servidor");
      }
      console.error("Error en el registro:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-green-600">
          Registro Médico
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="nombre"
            placeholder="Nombre"
            onChange={handleChange}
            value={form.nombre}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            name="apellido"
            placeholder="Apellido"
            onChange={handleChange}
            value={form.apellido}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            name="email"
            type="email"
            placeholder="Correo electrónico"
            onChange={handleChange}
            value={form.email}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            name="especialidad"
            placeholder="Especialidad"
            onChange={handleChange}
            value={form.especialidad}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            name="matricula"
            placeholder="Matrícula"
            onChange={handleChange}
            value={form.matricula}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            onChange={handleChange}
            value={form.password}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
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

export default RegistroMedico;
