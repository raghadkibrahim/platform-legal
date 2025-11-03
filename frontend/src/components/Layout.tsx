import { Link, useNavigate, useLocation, Outlet } from "react-router-dom";
import SidebarCases from "./SidebarCases";

export default function Layout() {
  const nav = useNavigate();
  const loc = useLocation();
  const isAuthed = true; // DEV: force authenticated layout to show sidebar

  function logout() {
    localStorage.removeItem("access_token");
    nav("/login");
  }

  if (isAuthed) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="sticky top-0 bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link to="/cases" className="font-semibold">Platform Legal</Link>
              <nav className="text-sm hidden md:block">
                <Link to="/cases" className="hover:underline">Cases</Link>
              </nav>
            </div>
            <button onClick={logout} className="text-sm px-3 py-1.5 rounded bg-black text-white">
              Logout
            </button>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-[280px_1fr] md:grid-cols-[300px_1fr] gap-4 py-6">
            <aside className="bg-white border rounded md:sticky md:top-[56px] h-[60vh] md:h-[calc(100vh-56px-48px)] overflow-auto">
              <SidebarCases activePath={loc.pathname} />
            </aside>
            <main className="min-w-0">
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="font-semibold">Platform Legal</Link>
          <Link to="/login" className="text-sm px-3 py-1.5 rounded border">Login</Link>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
