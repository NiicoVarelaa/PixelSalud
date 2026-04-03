import { useEffect, useMemo } from "react";

import Default from "@assets/default.webp";
import { useProductStore } from "@store/useProductStore";

const formatPrice = (value) => {
  const parsed = Number(value) || 0;
  const rounded = Math.round(parsed / 1000) * 1000;
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(rounded);
};

const getDiscount = (product) => {
  const fromMainField = Number(product?.porcentajeDescuento) || 0;
  const fromOffers = Array.isArray(product?.ofertas)
    ? product.ofertas
        .map(
          (offer) =>
            Number(offer?.porcentajeDescuento || offer?.descuento) || 0,
        )
        .filter((value) => value > 0)
    : [];

  return Math.max(fromMainField, ...fromOffers, 0);
};

const getCurrentPrice = (product) =>
  Number(
    product?.precioFinal || product?.precio || product?.precioRegular || 0,
  );

const isOfferProduct = (product) => {
  if (!product) return false;

  const hasDiscount = getDiscount(product) > 0;
  const hasOfferFlag = Boolean(product.enOferta);
  const hasOfferCollection =
    Array.isArray(product.ofertas) && product.ofertas.length > 0;
  const hasLowerFinalPrice =
    Number(product.precioFinal || 0) > 0 &&
    Number(product.precioRegular || 0) > Number(product.precioFinal || 0);

  return (
    hasDiscount || hasOfferFlag || hasOfferCollection || hasLowerFinalPrice
  );
};

const getProductImage = (product) => {
  if (!product) return Default;

  if (Array.isArray(product.imagenes) && product.imagenes.length > 0) {
    const principal =
      product.imagenes.find((img) => img?.esPrincipal && img?.urlImagen) ||
      product.imagenes.find((img) => img?.urlImagen);

    if (principal?.urlImagen) return principal.urlImagen;
  }

  return (
    product.urlImagen ||
    product.imagen ||
    product.imagenPrincipal ||
    product.img ||
    product.img1 ||
    Default
  );
};

const normalizeText = (value) => (value || "").trim();

export const usePromoBannerData = () => {
  const { productos, productosAbajo, isLoading, error, fetchProducts } =
    useProductStore();

  useEffect(() => {
    if (!productos.length && !isLoading) {
      fetchProducts();
    }
  }, [fetchProducts, isLoading, productos.length]);

  const offerProducts = useMemo(() => {
    const fromProducts = productos.filter(isOfferProduct);

    if (fromProducts.length > 0) return fromProducts;
    if (productosAbajo.length > 0) return productosAbajo;

    return productos;
  }, [productos, productosAbajo]);

  const heroSlides = useMemo(() => {
    const source = offerProducts.slice(0, 3);

    return source.map((product, index) => {
      const partner = offerProducts[(index + 1) % offerProducts.length];
      const discount = getDiscount(product);
      const price = getCurrentPrice(product);
      const category = normalizeText(product.categoria) || "Cuidado personal";

      return {
        id: String(product.idProducto || `promo-${index}`),
        dateText:
          discount > 0
            ? `${Math.round(discount)}% OFF por tiempo limitado`
            : "Oferta activa",
        title: normalizeText(product.nombreProducto) || "Producto destacado",
        subtitle: `${category} · ${formatPrice(price)}`,
        ctaText: "Ver producto",
        ctaTo: `/productos/${product.idProducto}`,
        ctaAriaLabel: `Ver detalle de ${normalizeText(product.nombreProducto) || "producto"}`,
        productImage: getProductImage(product),
        personImage: getProductImage(partner),
        personAlt: normalizeText(partner?.nombreProducto)
          ? `Producto complementario: ${partner.nombreProducto}`
          : "Producto complementario",
        showPerson: Boolean(
          partner && partner.idProducto !== product.idProducto,
        ),
      };
    });
  }, [offerProducts]);

  const sideCards = useMemo(() => {
    if (!offerProducts.length) return [];

    const grouped = offerProducts.reduce((acc, product) => {
      const key = normalizeText(product.categoria) || "Ofertas destacadas";
      const current = acc.get(key) || { products: [], maxDiscount: 0 };
      const discount = getDiscount(product);

      current.products.push(product);
      current.maxDiscount = Math.max(current.maxDiscount, discount);
      acc.set(key, current);

      return acc;
    }, new Map());

    return Array.from(grouped.entries())
      .sort((a, b) => b[1].maxDiscount - a[1].maxDiscount)
      .slice(0, 4)
      .map(([categoria, info], index) => {
        const sortedByDiscount = [...info.products].sort(
          (a, b) => getDiscount(b) - getDiscount(a),
        );
        const bestProduct = sortedByDiscount[0];
        const minPrice = Math.min(
          ...info.products.map((product) => getCurrentPrice(product)),
        );
        const hasLowStock = info.products.some(
          (product) =>
            Number(product?.stock || 0) > 0 &&
            Number(product?.stock || 0) <= 10,
        );

        let badge = "Oferta activa";
        if (hasLowStock) badge = "Ultimas unidades";
        else if (info.products.length >= 5) badge = "Mas elegidos";
        else if (info.maxDiscount > 0) badge = "Destacado";

        return {
          id: `${categoria}-${index}`,
          badge,
          title: categoria,
          subtitle: `Desde ${formatPrice(minPrice)}`,
          detail: normalizeText(bestProduct?.nombreProducto)
            ? `Destacado: ${bestProduct.nombreProducto}`
            : "Promociones activas hoy",
          ctaTo: `/productos?categoria=${encodeURIComponent(categoria)}`,
          ctaAriaLabel: `Ver ofertas de ${categoria}`,
        };
      });
  }, [offerProducts]);

  return {
    heroSlides,
    sideCards,
    isLoading,
    error,
  };
};
