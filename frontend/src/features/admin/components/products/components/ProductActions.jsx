import { Edit2, Trash2, RotateCcw } from "lucide-react";
import PropTypes from "prop-types";

const baseBtn =
  "transition-colors cursor-pointer focus:outline-none focus-visible:ring-2";

export const ProductActions = ({
  className,
  iconSize = 16,
  product,
  onEdit,
  onToggleActive,
  showTitles = false,
  tone = "soft",
}) => {
  const palette =
    tone === "strong"
      ? {
          edit: "bg-yellow-200 text-yellow-800 hover:bg-yellow-300 focus-visible:ring-yellow-600",
          remove:
            "bg-red-200 text-red-800 hover:bg-red-300 focus-visible:ring-red-600",
          reactivate:
            "bg-primary-200 text-primary-800 hover:bg-primary-300 focus-visible:ring-primary-600",
        }
      : {
          edit: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200 focus-visible:ring-yellow-500",
          remove:
            "bg-red-100 text-red-700 hover:bg-red-200 focus-visible:ring-red-500",
          reactivate:
            "bg-primary-100 text-primary-700 hover:bg-primary-200 focus-visible:ring-primary-500",
        };

  const titleProps = (text) => (showTitles ? { title: text } : {});

  return (
    <>
      <button
        onClick={() => onEdit(product)}
        className={`${className} ${palette.edit} ${baseBtn}`}
        aria-label={`Editar ${product.nombreProducto || product.idProducto}`}
        {...titleProps("Editar")}
      >
        <Edit2 size={iconSize} aria-hidden="true" />
      </button>

      {product.activo ? (
        <button
          onClick={() => onToggleActive(product)}
          className={`${className} ${palette.remove} ${baseBtn}`}
          aria-label={`Desactivar ${product.nombreProducto || product.idProducto}`}
          {...titleProps("Desactivar")}
        >
          <Trash2 size={iconSize} aria-hidden="true" />
        </button>
      ) : (
        <button
          onClick={() => onToggleActive(product)}
          className={`${className} ${palette.reactivate} ${baseBtn}`}
          aria-label={`Reactivar ${product.nombreProducto || product.idProducto}`}
          {...titleProps("Reactivar")}
        >
          <RotateCcw size={iconSize} aria-hidden="true" />
        </button>
      )}
    </>
  );
};

ProductActions.propTypes = {
  className: PropTypes.string,
  iconSize: PropTypes.number,
  product: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onToggleActive: PropTypes.func.isRequired,
  showTitles: PropTypes.bool,
  tone: PropTypes.string,
};

export default ProductActions;
