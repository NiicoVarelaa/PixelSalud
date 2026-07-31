const SidebarOverlay = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm transition-opacity lg:hidden"
      aria-hidden="true"
      onClick={onClose}
    />
  );
};

export default SidebarOverlay;
