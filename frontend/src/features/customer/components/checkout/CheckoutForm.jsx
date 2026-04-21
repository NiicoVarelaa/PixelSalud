import { motion, AnimatePresence } from "framer-motion";
import CheckoutPersonalDataStep from "./CheckoutPersonalDataStep";
import CheckoutPickupStep from "./CheckoutPickupStep";
import CheckoutPaymentStep from "./CheckoutPaymentStep";

const CheckoutForm = ({
  currentStep,
  personalData,
  branches,
  selectedBranchId,
  isProcessing,
  onContinuePersonalData,
  onSelectBranch,
  onContinuePickup,
  onBackToPersonalData,
  onBackToPickup,
  onSubmit,
}) => {
  const renderStep = () => {
    if (currentStep === 1) {
      return (
        <CheckoutPersonalDataStep
          defaultValues={personalData}
          onContinue={onContinuePersonalData}
        />
      );
    }

    if (currentStep === 2) {
      return (
        <CheckoutPickupStep
          branches={branches}
          selectedBranchId={selectedBranchId}
          onSelectBranch={onSelectBranch}
          onContinue={onContinuePickup}
          onBack={onBackToPersonalData}
        />
      );
    }

    return (
      <CheckoutPaymentStep
        onBack={onBackToPickup}
        onPay={onSubmit}
        isProcessing={isProcessing}
      />
    );
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {renderStep()}
      </motion.div>
    </AnimatePresence>
  );
};

export default CheckoutForm;
