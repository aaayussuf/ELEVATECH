import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";

export default function Header() {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="sticky top-0 z-30 min-h-16 bg-white shadow flex items-center justify-between gap-3 px-4 sm:px-6 py-3">
      <h1 className="truncate text-lg sm:text-xl font-bold">
        Admin Panel
      </h1>

      <div className="flex min-w-0 items-center gap-2 sm:gap-4">
        <span className="hidden min-[480px]:block max-w-[180px] truncate font-medium sm:max-w-none">
          {user?.name || user?.email || "Admin"}
        </span>

        <button
          onClick={logout}
          className="min-h-[44px] shrink-0 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 active:scale-95"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

