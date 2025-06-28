import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
     const response = await axios.post("http://localhost:5000/login", {
  email: user.email.toLowerCase(),
  contra: user.password,
});

      console.log("Login exitoso:", response.data);

      // Según rol redirigir
    const rol = response.data.rol?.toLowerCase();

if (rol === "cliente") {
  navigate("/");
} else if (rol === "empleado") {
  navigate("/panelempleados");
} else if (rol === "admin") {
  navigate("/admin");
} else {
  alert("Rol no reconocido");
}

      // Opcional: guardar datos en localStorage o context
      // localStorage.setItem("usuario", JSON.stringify(response.data));
    } catch (error) {
      if (error.response) {
        alert(error.response.data.error || "Credenciales incorrectas");
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
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Contraseña
            </label>
            <input
              type="password"
              placeholder="Contraseña"
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition duration-300"
          >
            Iniciar sesión
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          ¿No tenés cuenta?{" "}
          <Link
            to="/Registro"
            className="text-green-600 hover:underline"
          >
            Registrate acá
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
