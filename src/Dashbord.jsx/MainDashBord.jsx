import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useData } from "../context/DataContext";
import {
  FaHome,
  FaSignOutAlt,
  FaBell,
  FaSearch,
  FaCog,
  FaClipboardList,
  FaChartBar,
  FaUniversity,
  FaKey,
} from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdClose, MdDashboard } from "react-icons/md";

const menuClass = (isOpen) => ({ isActive }) =>
  `flex items-center rounded-xl transition-all duration-300 font-medium relative group
  ${isOpen ? 'gap-2 px-3 py-2' : 'justify-center p-2'}
  ${
    isActive
      ? "bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20 scale-[1.02]"
      : "text-slate-400 hover:text-white hover:bg-gradient-to-r hover:from-slate-700 hover:to-slate-600 hover:shadow-md hover:scale-[1.01]"
  }`;

export default function MainDashBord() {
  const [open, setOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [headerSearch, setHeaderSearch] = useState("");
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const { fetchSchools } = useData();

  const handleHeaderSearch = (e) => {
    const val = e.target.value;
    setHeaderSearch(val);
    navigate("/dashbord/college-management");
    fetchSchools(1, val);
  };

  useEffect(() => {
    const resize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      setOpen(!mobile);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const closeSidebar = () => isMobile && setOpen(false);

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-hidden">
      {/* Overlay (Mobile) */}
      {open && isMobile && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-0 left-0 h-full z-40
        bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white backdrop-blur-xl
        transition-all duration-500 ease-in-out overflow-hidden flex flex-col shadow-2xl
        ${open ? "w-56" : "w-0 lg:w-16"} border-r border-slate-700/50`}
      >
        {/* Logo */}
        <div className={`h-16 flex items-center justify-center border-b border-slate-700/50 flex-shrink-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 ${open ? 'justify-between px-4' : 'justify-center px-2'}`}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <MdDashboard size={16} className="text-white" />
            </div>
            {open && (
              <div>
                <h1 className="font-bold text-lg tracking-wide bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  EduPanel
                </h1>
                <p className="text-xs text-slate-400">Super Admin</p>
              </div>
            )}
          </div>

          {isMobile && (
            <button
              onClick={() => setOpen(false)}
              className="p-2 rounded-xl hover:bg-slate-700/50 transition"
            >
              <MdClose size={22} />
            </button>
          )}
        </div>

        {/* Menu */}
        <nav className={`space-y-1 mt-3 flex-1 overflow-y-auto custom-scrollbar ${open ? 'p-3' : 'p-2'}`}>
          <NavLink
            to="/dashbord"
            end
            className={menuClass(open)}
            onClick={closeSidebar}
          >
            <FaHome size={16} />
            {open && <span className="font-medium text-sm">Dashboard</span>}
            {!open && (
              <div className="absolute left-full ml-2 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Dashboard
              </div>
            )}
          </NavLink>
          <NavLink
            to="/dashbord/plans"
            className={menuClass(open)}
            onClick={closeSidebar}
          >
            <FaClipboardList size={16} />
            {open && <span className="font-medium text-sm">Plans</span>}
            {!open && (
              <div className="absolute left-full ml-2 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Plans
              </div>
            )}
          </NavLink>
          <NavLink
            to="/dashbord/college-management"
            className={menuClass(open)}
            onClick={closeSidebar}
          >
            <FaUniversity size={16} />
            {open && <span className="font-medium text-sm">School Management</span>}
            {!open && (
              <div className="absolute left-full ml-2 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                College Management
              </div>
            )}
          </NavLink>

          <NavLink
            to="/dashbord/reports"
            className={menuClass(open)}
            onClick={closeSidebar}
          >
            <FaChartBar size={16} />
            {open && <span className="font-medium text-sm">Reports</span>}
            {!open && (
              <div className="absolute left-full ml-2 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Reports
              </div>
            )}
          </NavLink>

          <NavLink
            to="/dashbord/change-password"
            className={menuClass(open)}
            onClick={closeSidebar}
          >
            <FaKey size={16} />
            {open && <span className="font-medium text-sm">Change Password</span>}
            {!open && (
              <div className="absolute left-full ml-2 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Change Password
              </div>
            )}
          </NavLink>
        </nav>

        {/* Logout Button */}
        <div className={`border-t border-slate-700/50 flex-shrink-0 ${open ? 'p-3' : 'p-2'}`}>
          <button
            onClick={async () => {
              const result = await Swal.fire({
                title: "Logout?",
                text: "Are you sure you want to logout?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#e11d48",
                cancelButtonColor: "#6366f1",
                confirmButtonText: "Yes, Logout",
                cancelButtonText: "Cancel",
              });
              if (result.isConfirmed) {
                localStorage.clear();
                navigate("/");
              }
            }}
            className={`flex w-full items-center justify-center rounded-xl cursor-pointer
            bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 
            hover:shadow-lg hover:shadow-red-500/20 hover:scale-[1.02] transition-all duration-300 font-medium
            ${open ? 'gap-2 px-4 py-3' : 'p-2'}`}
          >
            <FaSignOutAlt size={16} />
            {open && <span className="text-sm">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 flex items-center px-6 flex-shrink-0 shadow-sm">
          {/* Toggle Button */}
          <button
            onClick={() => setOpen(!open)}
            className="p-3 rounded-2xl hover:bg-slate-100 transition-all duration-200 hover:scale-105"
          >
            <GiHamburgerMenu size={22} className="text-slate-700" />
          </button>

          {/* Spacer */}
          <div className="flex-1"></div>

          {/* Right Side Content */}
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="w-72">
              <div className="relative">
                <FaSearch
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search schools..."
                  value={headerSearch}
                  onChange={handleHeaderSearch}
                  className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200
          focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                />
              </div>
            </div>

            {/* Settings */}
            <button className="p-3 rounded-2xl hover:bg-slate-100 transition-all hover:scale-105">
              <FaCog size={20} className="text-slate-600" />
            </button>

            {/* Profile */}
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-700">
                  {user?.email || "Admin"}
                </p>
                <p className="text-xs text-slate-500">Super Administrator</p>
              </div>
              <div
                className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600
        flex items-center justify-center text-white font-bold cursor-pointer
        hover:shadow-lg hover:scale-105 transition-all"
              >
                {user?.email?.[0]?.toUpperCase() || "A"}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <section className="flex-1 overflow-hidden">
          <div className="h-full bg-gradient-to-br from-white via-slate-50 to-blue-50 relative">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/3 via-purple-500/3 to-indigo-500/3"></div>
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-blue-400/8 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-purple-400/8 to-transparent rounded-full blur-3xl"></div>

            {/* Scrollable Content */}
            <div className="relative z-10 h-full overflow-auto p-6 custom-scrollbar">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 min-h-[calc(100vh-8rem)]">
                <Outlet />
              </div>
            </div>
          </div>
        </section>
      </main>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(51, 65, 85, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(51, 65, 85, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(51, 65, 85, 0.5);
        }
      `}</style>
    </div>
  );
}
