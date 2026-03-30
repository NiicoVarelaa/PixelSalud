import { Link, NavLink } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { ChevronRight, Home } from "lucide-react";
import { motion } from "framer-motion";
import Header from "@features/public/components/navigation/Header";
import { CheckoutForm } from "@features/customer/components/checkout";

import { useCheckout } from "../hooks/useCheckout";
import { CheckoutSteps } from "../components/checkout/CheckoutSteps";
import { OrderSummary } from "../components/checkout/OrderSummary";

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: "easeOut" } 
  },
};

const Checkout = () => {
  const {
    carrito,
    isAuthenticated,
    isProcessing,
    currentStep,
    personalData,
    branches,
    selectedBranchId,
    discountCode,
    appliedDiscount,
    appliedCouponCode,
    subtotal,
    total,
    setDiscountCode,
    setIsCartModalOpen,
    handleApplyDiscount,
    handleRemoveDiscount,
    handleContinuePersonalData,
    handleSelectBranch,
    handleContinuePickup,
    handleBackToPersonalData,
    handleBackToPickup,
    onSubmit,
    formatPrice,
  } = useCheckout();

  if (carrito.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="flex-1 flex items-center justify-center px-4 py-12"
        >
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Carrito Vacío
            </h2>
            <p className="text-gray-600">
              No hay productos en tu carrito para checkout.
            </p>
            <Link
              to="/productos"
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <FiArrowLeft className="mr-2" /> Volver a Productos
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex items-center justify-center px-4 py-12"
        >
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-gray-600">Verificando autenticación...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <motion.main 
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="mx-auto max-w-7xl px-4 py-6 md:py-8 space-y-6 md:space-y-8"
      >
        
        <motion.section variants={fadeUpVariants} className="space-y-4">
          <nav className="text-sm text-gray-500" aria-label="Breadcrumb">
            <ol className="inline-flex list-none items-center space-x-2 p-0">
              <li className="flex items-center">
                <NavLink to="/" className="flex items-center gap-1 hover:text-primary-700">
                  <Home size={16} /> Inicio
                </NavLink>
              </li>
              <li className="flex items-center">
                <ChevronRight size={16} className="text-gray-400" />
              </li>
              <li className="flex items-center">
                <button
                  onClick={() => setIsCartModalOpen(true)}
                  className="hover:text-primary-700 cursor-pointer"
                >
                  Carrito
                </button>
              </li>
              <li className="flex items-center">
                <ChevronRight size={16} className="text-gray-400" />
              </li>
              <li className="flex items-center font-medium text-gray-700">
                Checkout
              </li>
            </ol>
          </nav>

          <div className="space-y-2">
            <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900">
              Finalizar compra
            </h1>
            <p className="max-w-2xl text-sm md:text-base text-slate-600">
              Estás a un paso de completar tu pedido. Verificá tus datos y
              confirmá el pago seguro con Mercado Pago.
            </p>
          </div>
        </motion.section>

        <motion.div variants={fadeUpVariants}>
          <CheckoutSteps currentStep={currentStep} />
        </motion.div>

        <section className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          <motion.div variants={fadeUpVariants} className="lg:flex-1">
            <CheckoutForm
              currentStep={currentStep}
              personalData={personalData}
              branches={branches}
              selectedBranchId={selectedBranchId}
              isProcessing={isProcessing}
              onContinuePersonalData={handleContinuePersonalData}
              onSelectBranch={handleSelectBranch}
              onContinuePickup={handleContinuePickup}
              onBackToPersonalData={handleBackToPersonalData}
              onBackToPickup={handleBackToPickup}
              onSubmit={onSubmit}
            />
          </motion.div>

          <motion.div variants={fadeUpVariants} className="lg:w-[380px] xl:w-[420px]">
            <OrderSummary
              carrito={carrito}
              subtotal={subtotal}
              total={total}
              discountCode={discountCode}
              setDiscountCode={setDiscountCode}
              appliedCouponCode={appliedCouponCode}
              appliedDiscount={appliedDiscount}
              handleApplyDiscount={handleApplyDiscount}
              handleRemoveDiscount={handleRemoveDiscount}
              formatPrice={formatPrice}
            />
          </motion.div>
        </section>

      </motion.main>
    </div>
  );
};

export default Checkout;