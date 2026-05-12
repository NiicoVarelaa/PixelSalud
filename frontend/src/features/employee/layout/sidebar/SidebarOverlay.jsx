import { useEffect } from "react";

export const SidebarOverlay = ({ isVisible, onClose }) => {
  useEffect(() => {
    if (!isVisible) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
      onClick={onClose}
      aria-hidden="true"
    />
  );
};
