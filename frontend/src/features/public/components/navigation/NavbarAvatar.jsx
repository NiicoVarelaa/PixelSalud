const NavbarAvatar = ({ user, size = "medium" }) => {
  const sizeClasses = {
    tiny: "h-7 w-7 text-base",
    small: "h-8 w-8 text-lg",
    medium: "h-10 w-10 text-xl",
    large: "h-12 w-12 text-2xl",
  };
  const dotSize = {
    tiny: "h-2 w-2",
    small: "h-2.5 w-2.5",
    medium: "h-3 w-3",
    large: "h-3.5 w-3.5",
  };

  // Si hay imagen, mostrar imagen
  if (user?.imagen) {
    return (
      <div className="relative">
        <img
          className={`rounded-full object-cover ${sizeClasses[size]}`}
          src={user.imagen}
          alt={user.nombre || "Usuario"}
        />
      </div>
    );
  }

  // Si no hay imagen, mostrar iniciales
  const iniciales =
    `${user?.nombre?.charAt(0) || ""}${user?.apellido?.charAt(0) || ""}`.toUpperCase();
  return (
    <div
      className={`relative flex items-center justify-center rounded-full bg-primary-100 text-primary-700 font-bold ${sizeClasses[size]}`}
    >
      <span>{iniciales || "U"}</span>
    </div>
  );
};

export default NavbarAvatar;
