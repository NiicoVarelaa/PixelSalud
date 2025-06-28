import { Route, Routes, useLocation } from "react-router-dom";
import Inicio from "./pages/Inicio";
import Productos from "./pages/Productos";
import SobreNosotros from "./pages/SobreNosotros";
import Contacto from "./pages/Contacto";
import IniciaSesion from "./pages/IniciaSesion";
import Registro from "./pages/Registro";
import Producto from "./pages/Producto";
import Carrito from "./pages/Carrito";
import Header from "./components/Header";
import LoginMedico from "./pages/LoginMedico";
import LoginCliente from "./pages/LoginCliente";
import RegistroCliente from "./pages/RegistroCliente";
import RegistroMedico from "./pages/RegistroMedico";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Administrador from "./pages/Administrador";


const App = () => {
  const location = useLocation();

  // agrego el IF y USELOCATION para separar el header del admin

  // Si estamos en /admin o /admin/loque sea → mostrar solo admin
 if (location.pathname.startsWith("/admin")) {
    return (
      <Routes>
        <Route path="/admin/*" element={<Administrador/>} />
      </Routes>
    );
  }
 
  return (
    <div className="bg-gray-50 overflow-x-hidden">
      <ToastContainer position="bottom-right" autoClose={2500} />
      <Header />
      <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/sobreNosotros" element={<SobreNosotros />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/iniciaSesion" element={<IniciaSesion />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/productos/:id" element={<Producto />} />
          <Route path="/productos/:categoria?" element={<Productos />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path='/LoginMedico' element={<LoginMedico/>}/>
          <Route path='/LoginCliente' element={<LoginCliente/>}/>
          <Route path='/registroCliente' element={<RegistroCliente/>}/>
          <Route path="/registroMedico" element={<RegistroMedico />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
