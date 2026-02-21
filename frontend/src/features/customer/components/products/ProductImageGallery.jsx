import { useState, useEffect } from "react";
import Default from "@assets/default.webp";
import { BotonFavorito } from "@components/atoms";

const ProductImageGallery = ({ product }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (product?.img) {
      setSelectedImage(product.img);
    }
  }, [product]);

  const productImages = [
    product.img,
    product.img2,
    product.img3,
    product.img4,
    product.img5,
  ].map((img) => img || Default);

  return (
    <div className="p-6 lg:p-8 flex flex-col">
      <div className="flex flex-col-reverse sm:flex-row gap-4 flex-1">
        <div className="flex sm:flex-col gap-3 sm:gap-4">
          {productImages.map((img, index) => {
            const isDefaultImage = img === Default;
            return (
              <button
                key={index}
                onClick={() => !isDefaultImage && setSelectedImage(img)}
                disabled={isDefaultImage}
                className={`w-16 h-16 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 transition-all ${
                  selectedImage === img ? "border-primary-600" : "border-none"
                } ${
                  isDefaultImage
                    ? "cursor-not-allowed opacity-30"
                    : "cursor-pointer"
                }`}
              >
                <img
                  src={img}
                  alt={`Miniatura ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            );
          })}
        </div>
        <div className="relative flex-1 flex items-center justify-center rounded-xl overflow-hidden border border-gray-100">
          <BotonFavorito product={product} />
          {selectedImage && (
            <img
              src={selectedImage}
              alt={product.nombreProducto}
              className="max-h-full max-w-full object-contain"
              onError={(e) => {
                e.target.src = Default;
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductImageGallery;
