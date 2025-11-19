import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { toast } from "react-toastify";
// Podés reutilizar el NavbarEmpleado o crear uno NavbarMedico si querés cambiar el menú
import NavbarEmpleado from "../components/NavbarEmpleado"; 

// --- IMPORTAMOS LAS VISTAS (Las crearemos enseguida) ---
import MedicoNuevaReceta from "../components/MedicoNuevaReceta";
import MedicoMisRecetas from "../components/MedicoMisRecetas";

import { FileText, History, LogOut } from "lucide-react"; // Iconos

// =================================================================
// --- VISTA CARDS DEL MÉDICO ---
// =================================================================
const VistaMenuMedico = ({ onNavegar, user }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 animate-fadeIn">
      <h1 className="text-4xl font-bold text-gray-800 text-center">
        Hola, Dr/a. {user?.nombre} {user?.apellido} 🩺
      </h1>
      <p className="text-lg text-gray-600 text-center mt-2 mb-12">
        ¿Qué desea realizar hoy?
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
        
        {/* Card 1: Nueva Receta */}
        <div 
          onClick={() => onNavegar('nuevaReceta')}
          className="group p-10 bg-white rounded-2xl shadow-lg border border-blue-100 cursor-pointer hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center"
        >
          <div className="p-5 bg-blue-100 rounded-full mb-6 group-hover:bg-blue-600 transition-colors">
            <FileText size={50} className="text-blue-600 group-hover:text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Nueva Receta</h2>
          <p className="text-center text-gray-500 mt-2">Generar una receta digital para un paciente.</p>
        </div>

        {/* Card 2: Mis Recetas */}
        <div 
          onClick={() => onNavegar('misRecetas')}
          className="group p-10 bg-white rounded-2xl shadow-lg border border-green-100 cursor-pointer hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center"
        >
          <div className="p-5 bg-green-100 rounded-full mb-6 group-hover:bg-green-600 transition-colors">
            <History size={50} className="text-green-600 group-hover:text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Historial de Recetas</h2>
          <p className="text-center text-gray-500 mt-2">Ver estado de recetas emitidas y anular.</p>
        </div>

      </div>
    </div>
  );
};

// =================================================================
// --- COMPONENTE PRINCIPAL ---
// =================================================================
const PanelMedico = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [vistaActual, setVistaActual] = useState('inicio');

  // Protección de ruta
  useEffect(() => {
    if (!user || user.rol !== 'medico') {
        toast.error("Acceso exclusivo para médicos.");
        navigate('/login');
        return;
    }
  }, [user, navigate]);

  const handleVolver = () => setVistaActual('inicio');

  if (!user) return <div className="flex h-screen items-center justify-center">Cargando...</div>;

  const renderizarVista = () => {
    switch (vistaActual) {
      case 'nuevaReceta':
        return <MedicoNuevaReceta onVolver={handleVolver} />;
      case 'misRecetas':
        return <MedicoMisRecetas onVolver={handleVolver} />;
      case 'inicio':
      default:
        return <VistaMenuMedico onNavegar={setVistaActual} user={user} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-blue-50/50">
      <NavbarEmpleado /> {/* Podés usar el mismo navbar o uno simplificado */}
      <main className="flex-1">
        {renderizarVista()}
      </main>
    </div>
  );
};

export default PanelMedico;