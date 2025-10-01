
const NavbarAvatar = ({ cliente, size = "medium" }) => {
  const sizeClasses = {
    tiny: "h-7 w-7",  
    small: "h-8 w-8",
    medium: "h-10 w-10",
    large: "h-12 w-12",
  };

  const dotSize = {
    tiny: "h-1.5 w-1.5", 
    small: "h-2 w-2",
    medium: "h-2.5 w-2.5",
    large: "h-3 w-3",
  };

  const defaultImage =
    "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200";
  const avatarSrc = cliente?.imagen || defaultImage;
  const avatarAlt = cliente?.nombre || "Usuario";

  return (
    <div className="relative">
      <img
        className={`rounded-full object-cover ${sizeClasses[size]}`}
        src={avatarSrc}
        alt={avatarAlt}
        onError={(e) => {
          e.currentTarget.src = defaultImage;
        }}
      />
      <div
        className={`absolute bottom-0 right-0 rounded-full bg-green-500 border-2 border-white ${dotSize[size]}`}
      ></div>
    </div>
  );
};

export default NavbarAvatar;
