import React from "react";
import { useNavigate } from "react-router-dom";
import { FileText, History } from "lucide-react";
import { useAuthStore } from "@store/useAuthStore";

const VistaMenuMedico = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore(); // <--- Obtenemos datos aquí

  return (
    // Quitamos 'animate-fadeIn' para asegurar visibilidad
    <div className="flex flex-col items-center justify-start min-h-full bg-blue-50/30 p-6 pt-24">
      <h1 className="text-5xl font-extrabold text-gray-800 text-center tracking-tight">
        Hola,{" "}
        <span className="text-green-600">
          Dr/a. {user?.apellido || "Médico"}
        </span>{" "}
        🩺
      </h1>

      <p className="text-xl text-gray-500 text-center mt-4 mb-16 font-light">
        Gestión de recetas digitales simple y rápida
      </p>

      <div className="flex flex-wrap justify-center gap-10 w-full max-w-5xl">
        {/* Card 1: Nueva Receta */}
        <div
          onClick={() => navigate("nuevareceta")}
          className="group w-80 p-10 bg-white rounded-3xl shadow-lg border border-blue-100 cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-blue-300 flex flex-col items-center text-center"
        >
          <div className="p-6 bg-blue-100 rounded-full mb-6 group-hover:bg-blue-600 transition-colors duration-300">
            <FileText
              size={48}
              className="text-blue-600 group-hover:text-white transition-colors"
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
            Nueva Receta
          </h2>
          <p className="text-gray-500 mt-3">
            Generar receta digital para un paciente.
          </p>
        </div>

        {/* Card 2: Mis Recetas */}
        <div
          onClick={() => navigate("misrecetas")}
          className="group w-80 p-10 bg-white rounded-3xl shadow-lg border border-green-100 cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-green-300 flex flex-col items-center text-center"
        >
          <div className="p-6 bg-green-100 rounded-full mb-6 group-hover:bg-green-600 transition-colors duration-300">
            <History
              size={48}
              className="text-green-600 group-hover:text-white transition-colors"
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 group-hover:text-green-600 transition-colors">
            Historial
          </h2>
          <p className="text-gray-500 mt-3">
            Ver estado de recetas emitidas y anular.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VistaMenuMedico;
