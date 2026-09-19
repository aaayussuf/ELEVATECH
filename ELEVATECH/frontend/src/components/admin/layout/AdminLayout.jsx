import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import adminDashboardService from "../../../services/adminDashboardService";

export default function AdminLayout() {
  const [alertCount, setAlertCount] = useState(0);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const notes = await adminDashboardService.getNotifications();
        if (alive && Array.isArray(notes)) setAlertCount(notes.length);
      } catch {
        // header badge is optional — never block the layout
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="admin-shell flex min-h-screen min-w-0 overflow-x-clip">
      <Sidebar />

      <div className="admin-content flex flex-1 min-w-0 flex-col">
        <Header alerts={alertCount} />

        <main className="w-full min-w-0 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-7xl 2xl:max-w-[88rem]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

