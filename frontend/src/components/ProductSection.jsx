import CardProductos from "./CardProductos";

const ProductSection = ({ title, products }) => {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="my-16 md:my-20">
      <h2 className="text-2xl md:text-3xl font-medium mb-8 text-center lg:text-left text-gray-800 uppercase">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {products.map((product) => (
          <CardProductos key={product.idProducto} product={product} />
        ))}
      </div>
    </section>
  );
};

export default ProductSection;