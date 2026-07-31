const NavbarAvatar = ({ user, size = "medium" }) => {
  const sizeClasses = {
    tiny: "h-7 w-7 text-base",
    small: "h-8 w-8 text-lg",
    medium: "h-10 w-10 text-xl",
    large: "h-12 w-12 text-2xl",
  };

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
