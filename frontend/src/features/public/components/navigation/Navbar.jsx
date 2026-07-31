import { Link } from "react-router-dom";
import MiniBanner from "@features/public/components/banners/MiniBanner";
import { CartModal } from "@features/customer/components/cart";
import LogoPixelSalud from "@assets/LogoPixelSalud.webp";
import {
  ActionIcons,
  NavbarCategoriesDropdown,
  NavbarLinks,
  NavbarMenuCelular,
  NavbarOffersLink,
  NavbarSearchDesktop,
  NavbarSearchMobile,
} from "./components";
import { NAV_LINKS } from "./constants";
import { useNavbar } from "./hooks";

const Navbar = () => {
  const {
    user,
    totalItems,
    isMenuOpen,
    isProfileDropdownOpen,
    showBanner,
    searchTerm,
    isSearchOpen,
    isCategoriasOpen,
    suggestedProducts,
    isLoadingSuggestions,
    showSuggestions,
    menuRef,
    profileRef,
    categoriasRef,
    searchDesktopRef,
    searchMobileRef,
    setSearchTerm,
    setShowSuggestions,
    setIsSearchOpen,
    setIsMenuOpen,
    setIsProfileDropdownOpen,
    setIsCategoriasOpen,
    handleLogout,
    handleSearch,
    handleCloseSuggestions,
    handleCloseMobileSearch,
    handleCategoriaClick,
  } = useNavbar();

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${showBanner ? "translate-y-0" : "-translate-y-10 shadow-md"}`}
        aria-label="Main navigation"
      >
        <MiniBanner />
        <div className="bg-white">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-14">
            <div className="flex items-center justify-between gap-4 py-3 font-medium relative">
              <Link
                to="/"
                className="shrink-0"
                tabIndex={0}
                aria-label="Ir a inicio"
              >
                <img
                  className="w-auto h-8"
                  src={LogoPixelSalud}
                  alt="Logo Pixel Salud"
                />
              </Link>

              <NavbarSearchDesktop
                handleSearch={handleSearch}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                setShowSuggestions={setShowSuggestions}
                showSuggestions={showSuggestions}
                suggestedProducts={suggestedProducts}
                handleCloseSuggestions={handleCloseSuggestions}
                isLoadingSuggestions={isLoadingSuggestions}
                searchDesktopRef={searchDesktopRef}
              />

              <ActionIcons
                user={user}
                handleLogout={handleLogout}
                setIsSearchOpen={setIsSearchOpen}
                setIsMenuOpen={setIsMenuOpen}
                profileRef={profileRef}
                isProfileDropdownOpen={isProfileDropdownOpen}
                setIsProfileDropdownOpen={setIsProfileDropdownOpen}
                totalItems={totalItems}
                menuRef={menuRef}
              />
            </div>

            <nav className="hidden lg:block" aria-label="Enlaces principales">
              <ul className="flex items-center justify-center gap-8 pb-3 text-sm text-gray-700">
                <NavbarCategoriesDropdown
                  isCategoriasOpen={isCategoriasOpen}
                  setIsCategoriasOpen={setIsCategoriasOpen}
                  categoriasRef={categoriasRef}
                  handleCategoriaClick={handleCategoriaClick}
                />

                <NavbarOffersLink />

                <NavbarLinks navLinks={NAV_LINKS} />
              </ul>
            </nav>

            <NavbarSearchMobile
              isSearchOpen={isSearchOpen}
              handleSearch={handleSearch}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              setShowSuggestions={setShowSuggestions}
              showSuggestions={showSuggestions}
              suggestedProducts={suggestedProducts}
              handleCloseSuggestions={handleCloseSuggestions}
              isLoadingSuggestions={isLoadingSuggestions}
              searchMobileRef={searchMobileRef}
              handleCloseMobileSearch={handleCloseMobileSearch}
            />
          </div>
        </div>
      </nav>
      <div
        className="h-[98px] md:h-[98px] lg:h-[130px]"
        aria-hidden="true"
      ></div>
      <NavbarMenuCelular
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        menuRef={menuRef}
        user={user}
        handleLogout={handleLogout}
        navLinks={NAV_LINKS}
        totalItems={totalItems}
      />
      <CartModal />
    </>
  );
};

export default Navbar;
