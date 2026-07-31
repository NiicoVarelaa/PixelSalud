import { motion, AnimatePresence } from "framer-motion";
import { useCarritoStore } from "@store/useCarritoStore";
import { useNavbarMobileMenu } from "../../hooks";
import NavbarMobileHeader from "./NavbarMobileHeader";
import NavbarMobileUserPanel from "./NavbarMobileUserPanel";
import NavbarMobilePrimaryLinks from "./NavbarMobilePrimaryLinks";
import NavbarMobileAccountActions from "./NavbarMobileAccountActions";

const OVERLAY_TRANSITION = { duration: 0.18, ease: "easeOut" };
const PANEL_TRANSITION = { duration: 0.24, ease: [0.22, 1, 0.36, 1] };

const NavbarMenuCelular = ({
  isMenuOpen,
  setIsMenuOpen,
  menuRef,
  navLinks,
  user,
  handleLogout,
  totalItems = 0,
}) => {
  const setIsCartModalOpen = useCarritoStore(
    (state) => state.setIsCartModalOpen,
  );

  const {
    isCategoriasOpen,
    setIsCategoriasOpen,
    categoriasRef,
    closeButtonRef,
    closeMenu,
    handleCategoriaClick,
    handleCartOpen,
    handleLogoutClick,
    handleKeyDown,
  } = useNavbarMobileMenu({
    isMenuOpen,
    setIsMenuOpen,
    handleLogout,
    setIsCartModalOpen,
    menuRef,
  });

  return (
    <AnimatePresence initial={false}>
      {isMenuOpen && (
        <motion.div
          className="fixed inset-0 z-50"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 1 }}
        >
          <motion.div
            className="absolute inset-0 backdrop-blur-sm"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 1 }}
            transition={{ duration: 0 }}
            aria-hidden="true"
          />

          <motion.div
            className="absolute inset-0 bg-black/45"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={OVERLAY_TRANSITION}
            onClick={closeMenu}
            aria-hidden="true"
          />

          <motion.div
            ref={menuRef}
            className="absolute top-0 right-0 h-full w-full max-w-xs bg-white shadow-xl flex flex-col overflow-hidden"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={PANEL_TRANSITION}
            role="dialog"
            aria-modal="true"
            aria-label="Menú de navegación"
            onKeyDown={handleKeyDown}
          >
            <NavbarMobileHeader
              onCloseMenu={closeMenu}
              closeButtonRef={closeButtonRef}
            />

            <NavbarMobileUserPanel user={user} />

            <nav
              className="flex flex-col grow p-4 overflow-y-auto"
              aria-label="Navegación principal"
            >
              <NavbarMobilePrimaryLinks
                isCategoriasOpen={isCategoriasOpen}
                setIsCategoriasOpen={setIsCategoriasOpen}
                categoriasRef={categoriasRef}
                handleCategoriaClick={handleCategoriaClick}
                navLinks={navLinks}
                onCloseMenu={closeMenu}
              />

              <hr className="my-4 border-t border-gray-200" />

              <NavbarMobileAccountActions
                user={user}
                totalItems={totalItems}
                onCloseMenu={closeMenu}
                onCartOpen={handleCartOpen}
                onLogout={handleLogoutClick}
              />
            </nav>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NavbarMenuCelular;
