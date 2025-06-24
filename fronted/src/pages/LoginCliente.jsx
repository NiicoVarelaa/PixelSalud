import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const LoginCliente = () => {
  const [userCliente, setUserCliente] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/login", {
        email: userCliente.email,
        password: userCliente.password,
      });

      console.log("Login exitoso:", response.data);
      // localStorage.setItem('usuario', JSON.stringify(response.data));
      // navigate('/dashboard');
    } catch (error) {
      if (error.response) {
        alert(error.response.data.error);
      } else {
        alert("Error al conectar con el servidor");
      }
      console.error(error);
    }
  };

  const handleEmailInput = (e) => {
    setUserCliente({ ...userCliente, email: e.target.value });
  };

  const handlePasswordInput = (e) => {
    setUserCliente({ ...userCliente, password: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-green-600">
          Login
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              placeholder="Correo electrónico"
              onChange={handleEmailInput}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Contraseña
            </label>
            <input
              type="password"
              placeholder="Contraseña"
              onChange={handlePasswordInput}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition duration-300"
          >
            Loguear
          </button>
        </form>
        <p className="text-center mt-4 text-sm text-gray-600">
          ¿No tenés cuenta?
          <Link
            to="http://localhost:5173/registroCliente"
            className="text-green-600 hover:underline ml-1"
          >
            Registrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginCliente;
