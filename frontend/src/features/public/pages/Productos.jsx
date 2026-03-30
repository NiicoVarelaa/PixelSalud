import Header from "@features/public/components/navigation/Header.jsx";
import Footer from "@features/public/components/footer/Footer.jsx";
import { Breadcrumbs } from "@components/molecules/navigation";
import { ModalRecetas } from "@features/customer/components/prescription";

import { useProductosPage } from "../hooks/useProductosPage";
import { ProductTopBar } from "../components/products/ProductTopBar";
import { ProductSidebar } from "../components/products/ProductSidebar";
import { ProductGrid } from "../components/products/ProductGrid";
import { ProductPagination } from "../components/products/ProductPagination";

const Productos = () => {
  const {
    isLoading,
    productosPaginados,
    totalProductos,
    paginaActual,
    totalPaginas,
    updateParams,
    filtroCategoria,
    busqueda,
    ordenPrecio,
    campanaActiva,
    campanaDestacada,
    esCategoriaReceta,
    user,
    recetaBuscada,
    recetasActivas,
    showModalRecetas,
    setShowModalRecetas,
    setRecetasActivas,
    setRecetaBuscada,
    handleAddAllRecetaToCart,
  } = useProductosPage();

  return (
    <div>
      <Header />
      <main className="my-12 w-full max-w-7xl mx-auto lg:px-8">
        <Breadcrumbs categoria={filtroCategoria} />

        <ProductTopBar
          busqueda={busqueda}
          ordenPrecio={ordenPrecio}
          updateParams={updateParams}
        />

        <div className="flex flex-col md:flex-row gap-8 w-full my-8">
          <aside className="w-full md:w-56 shrink-0">
            <ProductSidebar
              filtroCategoria={filtroCategoria}
              updateParams={updateParams}
              campanaActiva={campanaActiva}
              campanaDestacada={campanaDestacada}
            />
          </aside>

          <div className="flex-1">
            <ProductGrid
              isLoading={isLoading}
              productos={productosPaginados}
              esCategoriaReceta={esCategoriaReceta}
              user={user}
              recetaBuscada={recetaBuscada}
              recetasActivas={recetasActivas}
              setShowModalRecetas={setShowModalRecetas}
              setRecetasActivas={setRecetasActivas}
              setRecetaBuscada={setRecetaBuscada}
            />

            {totalPaginas > 1 &&
              !showModalRecetas &&
              !(
                recetaBuscada &&
                recetasActivas.length > 0 &&
                user &&
                esCategoriaReceta
              ) && (
                <ProductPagination
                  paginaActual={paginaActual}
                  totalPaginas={totalPaginas}
                  totalProductos={totalProductos}
                  updateParams={updateParams}
                />
              )}
          </div>
        </div>
      </main>
      <Footer />

      <ModalRecetas
        isOpen={showModalRecetas}
        onClose={() => setShowModalRecetas(false)}
        recetas={recetasActivas}
        onAddAllToCart={handleAddAllRecetaToCart}
      />
    </div>
  );
};

export default Productos;
