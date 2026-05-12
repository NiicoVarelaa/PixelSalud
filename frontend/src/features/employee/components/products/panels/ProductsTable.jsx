import { COLUMNS } from "../utils/productos.utils";
import ProductTableRow from "./ProductTableRow";

const ProductsTable = ({ productosPaginados, modificarPermiso, onEdit, onToggle }) => (
  <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="border-b border-gray-100 bg-gray-50/50">
          <tr>
            {COLUMNS.map((col, i) => (
              <th
                key={col}
                className={`px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-gray-400 ${
                  i === 0 ? "w-20" : ""
                } ${
                  i === COLUMNS.length - 1 ? "text-center" : i === 4 || i === 5 ? "text-center" : i === 3 ? "text-right" : "text-left"
                }`}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {productosPaginados.map((prod) => (
            <ProductTableRow
              key={prod.idProducto}
              prod={prod}
              modificarPermiso={modificarPermiso}
              onEdit={onEdit}
              onToggle={onToggle}
            />
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default ProductsTable;
