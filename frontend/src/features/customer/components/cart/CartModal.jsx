import { motion, AnimatePresence } from "framer-motion";
import useCartModal from "./hooks/useCartModal";
import CartModalHeader from "./modal/CartModalHeader";
import CartEmptyState from "./modal/CartEmptyState";
import CartItemCard from "./modal/CartItemCard";
import CartSummaryFooter from "./modal/CartSummaryFooter";
import CartConfirmDialog from "./modal/CartConfirmDialog";

const CartModal = () => {
  const {
    carrito,
    isCartModalOpen,
    subtotal,
    totalItems,
    imagenesPrincipales,
    showDeleteModal,
    showEmptyCartModal,
    closeModal,
    goToProducts,
    handleCheckout,
    openDeleteConfirm,
    closeDeleteConfirm,
    confirmDelete,
    setShowEmptyCartModal,
    confirmEmptyCart,
    decreaseQuantity,
    increaseQuantity,
  } = useCartModal();

  if (!isCartModalOpen) return null;

  return (
    <AnimatePresence>
      {isCartModalOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-9998"
            onClick={closeModal}
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[480px] bg-white shadow-2xl z-9999 flex flex-col"
          >
            <CartModalHeader totalItems={totalItems} onClose={closeModal} />

            <div className="flex-1 overflow-y-auto">
              {carrito.length === 0 ? (
                <CartEmptyState onExploreProducts={goToProducts} />
              ) : (
                <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                  {carrito.map((product) => (
                    <CartItemCard
                      key={product.idProducto}
                      product={product}
                      imageUrl={imagenesPrincipales[product.idProducto]}
                      onProductClick={closeModal}
                      onDelete={() => openDeleteConfirm(product.idProducto)}
                      onDecrease={() => decreaseQuantity(product.idProducto)}
                      onIncrease={() => increaseQuantity(product.idProducto)}
                    />
                  ))}
                </div>
              )}
            </div>

            {carrito.length > 0 && (
              <CartSummaryFooter
                subtotal={subtotal}
                onOpenEmptyCartConfirm={() => setShowEmptyCartModal(true)}
                onCheckout={handleCheckout}
                onContinueShopping={goToProducts}
              />
            )}
          </motion.div>

          {showDeleteModal && (
            <CartConfirmDialog
              title="¿Eliminar producto?"
              description="Esta acción no se puede deshacer."
              confirmLabel="Eliminar"
              onClose={closeDeleteConfirm}
              onConfirm={confirmDelete}
            />
          )}

          {showEmptyCartModal && (
            <CartConfirmDialog
              title="¿Vaciar carrito?"
              description="Se eliminarán todos los productos de tu carrito."
              confirmLabel="Vaciar"
              onClose={() => setShowEmptyCartModal(false)}
              onConfirm={confirmEmptyCart}
            />
          )}
        </>
      )}
    </AnimatePresence>
  );
};

export default CartModal;
