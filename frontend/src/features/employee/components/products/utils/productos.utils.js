export const formatMoneda = (val) => {
  const num = Number(val);
  if (!Number.isFinite(num)) return "$0";
  return `$${num.toLocaleString("es-AR")}`;
};

export const ITEMS_POR_PAGINA = 8;

export const COLUMNS = ["", "Producto", "Categoría", "Precio", "Stock", "Estado", "Acciones"];

export const CATEGORIAS = ["Medicamentos", "Dermocosmética", "Higiene", "Perfumería", "Accesorios"];
