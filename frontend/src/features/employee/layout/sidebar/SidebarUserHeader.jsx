export const SidebarUserHeader = ({ user }) => {
  const iniciales = `${user?.nombre?.charAt(0) || ""}${user?.apellido?.charAt(0) || ""}`.toUpperCase();

  return (
    <div className="border-b border-gray-100 px-5 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-600 text-sm font-bold text-white shadow-sm">
          {iniciales}
        </div>
        <div className="min-w-0">
          <h2 className="truncate text-sm font-semibold text-gray-800">
            {user?.nombre} {user?.apellido}
          </h2>
          <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">
            PixelSalud &middot; Empleado
          </p>
        </div>
      </div>
    </div>
  );
};
