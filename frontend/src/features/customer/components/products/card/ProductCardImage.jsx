import { ShoppingCart } from "lucide-react";
import cyberMonday from "@assets/Logo-cyber-monday.png";
import Default from "@assets/default.webp";

const ProductCardImage = ({
  product,
  principalImage,
  hoverImage,
  imageLoaded,
  onImageLoad,
  isCyberMondayProduct,
}) => {
  return (
    <div className="w-full h-48 flex items-center justify-center p-4 relative overflow-hidden bg-white">
      {!imageLoaded && (
        <div className="absolute inset-0 bg-white animate-pulse rounded-t-2xl flex items-center justify-center">
          <ShoppingCart className="w-10 h-10 text-gray-300" />
        </div>
      )}

      <img
        src={principalImage}
        alt={product.nombreProducto}
        className={`absolute max-h-[85%] rounded-[inherit] object-contain transition-all duration-500 group-hover:scale-105 ${
          hoverImage ? "group-hover:opacity-0" : ""
        } ${imageLoaded ? "opacity-100" : "opacity-0"}`}
        onLoad={onImageLoad}
        onError={(event) => {
          event.target.src = Default;
        }}
        loading="lazy"
      />

      {hoverImage && (
        <img
          src={hoverImage}
          alt={`${product.nombreProducto} - vista alternativa`}
          className="absolute max-h-[85%] rounded-[inherit] object-contain opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:scale-105"
          loading="lazy"
        />
      )}

      {isCyberMondayProduct && (
        <img
          src={cyberMonday}
          alt="Cyber Monday"
          className="absolute left-3 bottom-3 z-30 w-14 h-auto object-contain drop-shadow-md"
          style={{ imageRendering: "auto" }}
        />
      )}

      <div className="absolute inset-0 bg-transparent transition-all duration-300"></div>
    </div>
  );
};

export default ProductCardImage;
