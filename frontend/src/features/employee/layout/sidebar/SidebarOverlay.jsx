import { useModalLock } from "@hooks/useModalLock";

export const SidebarOverlay = ({ isVisible, onClose }) => {
  useModalLock(isVisible);

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
      onClick={onClose}
      aria-hidden="true"
    />
  );
};
