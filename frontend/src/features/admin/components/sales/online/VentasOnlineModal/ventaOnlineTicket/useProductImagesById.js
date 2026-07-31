import { useEffect, useMemo, useState } from "react";
import apiClient from "@utils/apiClient";
import { FALLBACK_IMAGE } from "./ticket.utils";

const hasOwnImage = (item) => {
  return Boolean(
    item.imagenProducto ||
    item.img ||
    item.urlImagen ||
    item.imagen ||
    item.imagenPrincipal,
  );
};

export const useProductImagesById = (productos) => {
  const [imagenesPorProducto, setImagenesPorProducto] = useState({});

  const idsSinImagen = useMemo(() => {
    return productos
      .map((item) => item.idProducto)
      .filter(
        (idProducto) =>
          idProducto &&
          !imagenesPorProducto[idProducto] &&
          !productos.some(
            (item) => item.idProducto === idProducto && hasOwnImage(item),
          ),
      );
  }, [imagenesPorProducto, productos]);

  useEffect(() => {
    if (idsSinImagen.length === 0) {
      return;
    }

    let isCancelled = false;

    const cargarImagenes = async () => {
      const resultados = await Promise.all(
        idsSinImagen.map(async (idProducto) => {
          try {
            const res = await apiClient.get(
              `/productos/${idProducto}/imagenes/principal`,
            );
            return [idProducto, res.data?.urlImagen || FALLBACK_IMAGE];
          } catch {
            return [idProducto, FALLBACK_IMAGE];
          }
        }),
      );

      if (isCancelled) {
        return;
      }

      setImagenesPorProducto((prev) => {
        const next = { ...prev };
        resultados.forEach(([idProducto, url]) => {
          next[idProducto] = url;
        });
        return next;
      });
    };

    cargarImagenes();

    return () => {
      isCancelled = true;
    };
  }, [idsSinImagen]);

  return imagenesPorProducto;
};
