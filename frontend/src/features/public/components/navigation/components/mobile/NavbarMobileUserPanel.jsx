import NavbarAvatar from "../NavbarAvatar";
import { capitalizeName } from "../../utils";

const NavbarMobileUserPanel = ({ user }) => {
  if (!user) {
    return null;
  }

  return (
    <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
      <div className="flex items-center gap-3">
        <NavbarAvatar user={user} size="medium" />
        <div>
          <p className="font-semibold text-gray-900 text-sm">
            {capitalizeName(user?.nombre)}
          </p>
          <p className="text-xs text-gray-600">{user.email}</p>
        </div>
      </div>
    </div>
  );
};

export default NavbarMobileUserPanel;
