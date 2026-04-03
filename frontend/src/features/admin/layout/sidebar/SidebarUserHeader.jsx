const SidebarUserHeader = ({ user }) => {
  return (
    <div className="border-b border-gray-100 bg-linear-to-br from-green-50 to-white p-5">
      <div className="mb-3 flex items-center gap-3">
        <div className="relative">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-700 text-xl font-bold text-white shadow-lg"
            aria-hidden="true"
          >
            {user?.nombre?.charAt(0)}
            {user?.apellido?.charAt(0)}
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="truncate text-sm font-bold text-gray-900">
            {user?.nombre} {user?.apellido}
          </h2>
          <p className="text-xs font-medium capitalize text-gray-600">
            {user?.rol || "Administrador"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SidebarUserHeader;
