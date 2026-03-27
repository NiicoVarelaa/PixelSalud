import { useEffect } from "react";

import { ShieldCheck, ShoppingBasket } from "lucide-react";

import { useProductStore } from "@store/useProductStore";

import {
  PersonalAttentionCard,
  LoyaltyCard,
} from "@components/molecules/cards";
import { PrescriptionCard } from "@features/customer/components/prescription";
import { IconCard } from "@components/atoms";

const BannerGrid = () => {
  const productosArriba = useProductStore((state) => state.productosArriba);
  const fetchProducts = useProductStore((state) => state.fetchProducts);

  useEffect(() => {
    if (productosArriba.length === 0) {
      fetchProducts();
    }
  }, [fetchProducts, productosArriba.length]);

  return (
    <div>
      <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-3 lg:grid-cols-4 auto-rows-min">
        <PersonalAttentionCard />
        <IconCard
          icon={<ShieldCheck className="h-7 w-7" />}
          titulo="Pagá Seguro"
          texto="Tus datos siempre protegidos con encriptación avanzada."
          destacado="Compra 100% Segura"
          bgColor="bg-secondary-500"
          textColor="text-gray-600"
          animation="hover:scale-105 hover:-translate-y-1 transition-all duration-300"
        />
        <LoyaltyCard />
        <PrescriptionCard />
        <IconCard
          icon={<ShoppingBasket className="h-7 w-7" />}
          titulo="Retiro en Tienda"
          texto="Comprá online y retirá gratis en nuestras sucursales."
          destacado="¡Sin Costo Adicional!"
          bgColor="bg-primary-700"
          textColor="text-gray-600"
          animation="hover:scale-105 hover:-translate-y-1 transition-all duration-300"
        />
      </div>
    </div>
  );
};

export default BannerGrid;
