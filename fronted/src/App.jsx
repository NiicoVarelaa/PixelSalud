import { Route, Routes, useLocation } from "react-router-dom";
import Inicio from "./pages/Inicio";
import Productos from "./pages/Productos";
import SobreNosotros from "./pages/SobreNosotros";
import Contacto from "./pages/Contacto";
import Registro from "./pages/Registro";
import Producto from "./pages/Producto";
import Carrito from "./pages/Carrito";
import Header from "./components/Header";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Administrador from "./pages/Administrador";
import PanelEmpleados from "./pages/PanelEmpleados";
import MisCompras from "./pages/MisCompras";
import Error404 from "./pages/Error404";

const App = () => {
  const location = useLocation();

  // agrego el IF y USELOCATION para separar el header del admin

  // Si estamos en /admin o /admin/loque sea → mostrar solo admin
  if (location.pathname.startsWith("/admin")) {
    return (
      <Routes>
        <Route path="/admin/*" element={<Administrador />} />
      </Routes>
    );
  }

  if (location.pathname.startsWith("/panelempleados")) {
    return (
      <Routes>
        <Route path="/panelempleados" element={<PanelEmpleados />} />
      </Routes>
    );
  }
<<<<<<< HEAD

=======
 
  
>>>>>>> 334423b68b3794427cff545fd2b7b3b0d7cc6548
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
          <Route path="/Registro" element={<Registro />} />
          <Route path="/productos/:id" element={<Producto />} />
          <Route path="/productos/:categoria?" element={<Productos />} />
          <Route path="/carrito" element={<Carrito />} />
<<<<<<< HEAD
          <Route path="/Login" element={<Login />} />
          <Route path="/MisCompras" element={<MisCompras />} />
=======
          <Route path='/LoginCliente' element={<LoginCliente/>}/>
          <Route path='/registroCliente' element={<RegistroCliente/>}/>
          <Route path="/MisCompras" element={<MisCompras/>} />
          <Route path="*" element={<Error404/>}/>
>>>>>>> 334423b68b3794427cff545fd2b7b3b0d7cc6548
        </Routes>
      </div>
    </div>
  );
};

export default App;
