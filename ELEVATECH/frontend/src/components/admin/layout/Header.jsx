import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";

export default function Header() {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="h-16 bg-white shadow flex items-center justify-between px-6">
      <h1 className="text-xl font-bold">
        Admin Panel
      </h1>

      <div className="flex items-center gap-4">
        <span className="font-medium">
          {user?.name || user?.email || "Admin"}
        </span>

        <button
          onClick={logout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

