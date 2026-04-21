import Default from "@assets/default.webp";

export const getProductImage = (producto) => {
  return (
    producto?.img ||
    producto?.urlImagen ||
    producto?.imagen ||
    producto?.imagenPrincipal ||
    Default
  );
};

export const filtrarCategoriasPermitidas = (categorias) => {
  return categorias.filter((categoria) => {
    const catLower = categoria.toLowerCase();
    return (
      !catLower.includes("cyber") &&
      !catLower.includes("black friday") &&
      !catLower.includes("oferta") &&
      !catLower.includes("descuento") &&
      !catLower.includes("promo")
    );
  });
};

export const buildOpcionesCategoria = (categorias) => {
  return [
    { value: "todas", label: "Todas las categorías" },
    ...categorias.map((cat) => ({ value: cat, label: cat })),
  ];
};

export const requiereReceta = (producto) => {
  return producto?.requiereReceta === 1 || producto?.requiereReceta === true;
};

export const formatearPrecio = (valor) => {
  return new Intl.NumberFormat("es-AR").format(Number(valor) || 0);
};
