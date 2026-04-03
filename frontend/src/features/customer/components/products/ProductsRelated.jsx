import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { CardProductos } from "@features/customer/components/products";
import { RelatedCategoryCta, RelatedHeader, RelatedNavButton } from "./related";
import { useProductsRelated } from "./utils";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";

const ProductsRelated = ({ relatedProducts, category }) => {
  const {
    headingId,
    prevId,
    nextId,
    isBeginning,
    isEnd,
    swiperParams,
    handleCategoryClick,
  } = useProductsRelated({ category });

  if (!relatedProducts?.length) return null;

  return (
    <section aria-labelledby={headingId} className="w-full">
      <RelatedHeader
        headingId={headingId}
        category={category}
        onCategoryClick={handleCategoryClick}
      />

      <div className="flex items-center gap-2 sm:gap-3">
        <RelatedNavButton
          id={prevId}
          direction="left"
          label="Ver productos anteriores"
          disabled={isBeginning}
        />

        <div className="flex-1 min-w-0">
          <Swiper {...swiperParams} className="pb-2!">
            {relatedProducts.map((product, idx) => (
              <SwiperSlide key={product.idProducto}>
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: idx * 0.05 }}
                  className="h-full"
                >
                  <CardProductos product={product} />
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <RelatedNavButton
          id={nextId}
          direction="right"
          label="Ver más productos"
          disabled={isEnd}
        />
      </div>

      <div className="mt-6 sm:hidden">
        <RelatedCategoryCta
          category={category}
          onCategoryClick={handleCategoryClick}
          mobile={true}
        />
      </div>

      <div className="hidden sm:flex justify-center mt-8">
        <RelatedCategoryCta
          category={category}
          onCategoryClick={handleCategoryClick}
        />
      </div>
    </section>
  );
};

export default ProductsRelated;
