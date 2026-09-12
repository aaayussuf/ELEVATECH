import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen min-w-0 bg-gray-100 overflow-x-clip">
      <Sidebar />

      <div className="admin-content flex flex-1 min-w-0 flex-col">
        <Header />

        <main className="w-full min-w-0 p-4 sm:p-6">
          <div className="mx-auto w-full max-w-7xl 2xl:max-w-[88rem]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

