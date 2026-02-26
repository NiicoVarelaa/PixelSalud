import { useState, useEffect } from "react";
import Default from "@assets/default.webp";
import { BotonFavorito } from "@components/atoms";
import apiClient from "@utils/apiClient";

const ProductImageGallery = ({ product }) => {
  const [imagenes, setImagenes] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchImagenes = async () => {
      if (!product?.idProducto) return;
      try {
        const res = await apiClient.get(
          `/productos/${product.idProducto}/imagenes`,
        );
        const imgs = res.data && Array.isArray(res.data) ? res.data : [];
        setImagenes(imgs);
        if (imgs.length > 0) {
          const principal = imgs.find((img) => img.esPrincipal) || imgs[0];
          setSelectedImage(principal.urlImagen);
        } else if (product.img) {
          setSelectedImage(product.img);
        } else {
          setSelectedImage(Default);
        }
      } catch (err) {
        setImagenes([]);
        setSelectedImage(product.img || Default);
      }
    };
    fetchImagenes();
  }, [product]);

  const handleSelect = (imgUrl) => {
    setSelectedImage(imgUrl);
  };

  // Fallback: legacy images if no Cloudinary
  const thumbnails =
    imagenes.length > 0
      ? imagenes
      : [
          {
            urlImagen: product.img || Default,
            altText: product.nombreProducto,
          },
          {
            urlImagen: product.img2 || Default,
            altText: product.nombreProducto,
          },
          {
            urlImagen: product.img3 || Default,
            altText: product.nombreProducto,
          },
          {
            urlImagen: product.img4 || Default,
            altText: product.nombreProducto,
          },
          {
            urlImagen: product.img5 || Default,
            altText: product.nombreProducto,
          },
        ];

  return (
    <div className="p-6 lg:p-8 flex flex-col">
      <div className="flex flex-col-reverse sm:flex-row gap-4 flex-1">
        <div className="flex sm:flex-col gap-3 sm:gap-4">
          {thumbnails.map((img, index) => {
            const isDefaultImage = img.urlImagen === Default;
            return (
              <button
                key={index}
                onClick={() => !isDefaultImage && handleSelect(img.urlImagen)}
                disabled={isDefaultImage}
                className={`w-16 h-16 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 transition-all ${
                  selectedImage === img.urlImagen
                    ? "border-primary-600"
                    : "border-none"
                } ${
                  isDefaultImage
                    ? "cursor-not-allowed opacity-30"
                    : "cursor-pointer"
                }`}
              >
                <img
                  src={img.urlImagen}
                  alt={img.altText || `Miniatura ${index + 1}`}
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
