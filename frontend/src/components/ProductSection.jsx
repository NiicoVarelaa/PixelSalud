import CardProductos from "./CardProductos";

const ProductSection = ({ title, products }) => {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="my-16 md:my-20">
      <h2
        className="text-2xl md:text-3xl 
        font-bold 
        mb-8 
        text-center lg:text-left 
        text-gray-800
        relative
        inline-block
        after:content-['']
        after:block
        after:w-1/3
        after:h-1
        after:bg-gradient-to-r
        after:from-primary-500
        after:to-secondary-500
        after:rounded-full
        after:mt-2
        after:transition-all
        after:duration-300
        hover:after:w-full
        transform
        hover:scale-105
        transition-transform
        duration-300
        uppercase
        cursor-default"
      >
        {title}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {products.map((product) => (
          <CardProductos key={product.idProducto} product={product} />
        ))}
      </div>
    </section>
  );
};

export default ProductSection;
