import Header from '../components/Header'
import Footer from '../components/Footer'
import MainCarrito from '../components/MainCarrito'

const Carrito = () => {
  return (
    <div>
      <Header />
      <MainCarrito breadcrumbsCategoria="carrito"/>
      <Footer/>
    </div>
  )
}

export default Carrito