import { useCallback, useEffect, useMemo, useState } from "react";
import Default from "@assets/default.webp";
import apiClient from "@utils/apiClient";

const buildFallbackImages = (img, img2, img3, img4, img5, nombreProducto) => {
  const candidates = [img, img2, img3, img4, img5];

  const unique = [];
  for (const url of candidates) {
    if (!url || url === Default || unique.includes(url)) continue;
    unique.push(url);
  }

  return unique.map((url) => ({
    urlImagen: url,
    altText: nombreProducto,
  }));
};

const useProductImageGallery = ({ product }) => {
  const [imagenes, setImagenes] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchImagenes = async () => {
      if (!product?.idProducto) {
        setImagenes([]);
        setSelectedIndex(0);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await apiClient.get(
          `/productos/${product.idProducto}/imagenes`,
        );
        const fetched = Array.isArray(response.data) ? response.data : [];

        setImagenes(fetched);

        if (fetched.length > 0) {
          const principalIndex = Math.max(
            fetched.findIndex((img) => img.esPrincipal),
            0,
          );
          setSelectedIndex(principalIndex);
        } else {
          setSelectedIndex(0);
        }
      } catch {
        setImagenes([]);
        setSelectedIndex(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImagenes();
  }, [product?.idProducto]);

  const fallbackImages = useMemo(
    () =>
      buildFallbackImages(
        product?.img,
        product?.img2,
        product?.img3,
        product?.img4,
        product?.img5,
        product?.nombreProducto,
      ),
    [
      product?.img,
      product?.img2,
      product?.img3,
      product?.img4,
      product?.img5,
      product?.nombreProducto,
    ],
  );

  const validThumbs = useMemo(() => {
    if (imagenes.length > 0) {
      return imagenes;
    }

    const fallback = fallbackImages;
    if (fallback.length > 0) return fallback;

    return [{ urlImagen: Default, altText: product?.nombreProducto }];
  }, [fallbackImages, imagenes, product?.nombreProducto]);

  useEffect(() => {
    if (selectedIndex <= validThumbs.length - 1) return;
    setSelectedIndex(0);
  }, [selectedIndex, validThumbs.length]);

  const selectedImage = validThumbs[selectedIndex]?.urlImagen || Default;

  const handleSelectByIndex = useCallback(
    (index) => {
      const nextIndex = Math.max(0, Math.min(index, validThumbs.length - 1));
      setSelectedIndex(nextIndex);
      setIsZoomed(false);
    },
    [validThumbs.length],
  );

  const handlePrev = useCallback(() => {
    setSelectedIndex(
      (prev) => (prev - 1 + validThumbs.length) % validThumbs.length,
    );
    setIsZoomed(false);
  }, [validThumbs.length]);

  const handleNext = useCallback(() => {
    setSelectedIndex((prev) => (prev + 1) % validThumbs.length);
    setIsZoomed(false);
  }, [validThumbs.length]);

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "ArrowLeft") handlePrev();
      if (event.key === "ArrowRight") handleNext();
      if (event.key === "Escape") setIsZoomed(false);
    },
    [handleNext, handlePrev],
  );

  return {
    isLoading,
    isZoomed,
    selectedImage,
    selectedIndex,
    validThumbs,
    handleKeyDown,
    handleNext,
    handleSelectByIndex,
    handlePrev,
    setIsZoomed,
  };
};

export default useProductImageGallery;
