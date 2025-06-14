import { Route, Routes } from 'react-router-dom';
import Inicio from './pages/Inicio';
import Tienda from './pages/Tienda';
import SobreNosotros from './pages/SobreNosotros';
import Contacto from './pages/Contacto';
import IniciaSesion from './pages/IniciaSesion';
import Registro from './pages/Registro';
import Producto from './pages/Producto';
import Carrito from './pages/Carrito';

const App = () => {
  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 bg-body'>
        
    <Routes>
      <Route path='/' element={<Inicio />} />
      <Route path='/tienda' element={<Tienda />}/>
      <Route path='/sobreNosotros' element={<SobreNosotros />}/>
      <Route path='/contacto' element={<Contacto />}/>
      <Route path='/iniciaSesion' element={<IniciaSesion />}/>
      <Route path='/registro' element={<Registro />}/>
      <Route path='/producto/:productoId' element={<Producto />} />
      <Route path='/carrito' element={<Carrito />} />
    </Routes>

    </div>
  )
}

export default App