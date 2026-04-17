import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUniversity, FaUserTie, FaCheckCircle, FaTimesCircle,
  FaBriefcase, FaBuilding, FaGraduationCap,
} from "react-icons/fa";
import { useData } from "../context/DataContext";

const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const { stats, loadingStats, fetchStats, fetchPlans, fetchSchools } = useData();

  useEffect(() => {
    // Prefetch all data in parallel on dashboard load
    fetchStats();
    fetchPlans();
    fetchSchools(1, "");
  }, []);

  const statCards = stats?.overview
    ? [
        { title: "Total School Admin", value: stats.overview.totalClients, icon: <FaUserTie size={28} />, gradient: "from-blue-500 to-blue-600" },
        { title: "Active Admin", value: stats.overview.activeClients, icon: <FaCheckCircle size={28} />, gradient: "from-green-500 to-green-600" },
        { title: "Inactive Admin", value: stats.overview.inactiveClients, icon: <FaTimesCircle size={28} />, gradient: "from-red-500 to-red-600" },
        { title: "Total Plans", value: stats.overview.totalPlans, icon: <FaBriefcase size={28} />, gradient: "from-purple-500 to-purple-600" },
        { title: "Total Branches", value: stats.overview.totalBranches, icon: <FaBuilding size={28} />, gradient: "from-orange-500 to-orange-600" },
        { title: "Total Students", value: stats.overview.totalStudents?.toLocaleString(), icon: <FaGraduationCap size={28} />, gradient: "from-indigo-500 to-indigo-600" },
      ]
    : [];

  const recentClients = stats?.recentActivity || [];

  if (loadingStats && !stats) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-64 bg-slate-200 rounded-xl animate-pulse"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-28 bg-slate-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Super Admin Dashboard
        </h1>
        <p className="text-slate-600 mt-1">Control and monitor the entire education system</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {statCards.map((item, index) => (
          <div
            key={index}
            className={`relative overflow-hidden rounded-xl p-6 text-white bg-gradient-to-r ${item.gradient} transition-all duration-300 hover:scale-[1.02] hover:shadow-xl`}
          >
            <div className="relative z-10 flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-white/20">
                <div className="scale-75">{item.icon}</div>
              </div>
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Stats</span>
            </div>
            <h4 className="text-sm opacity-90 mb-1">{item.title}</h4>
            <p className="text-2xl font-bold">{item.value ?? "—"}</p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Management Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <div
            onClick={() => navigate("/dashbord/college-management")}
            className="group cursor-pointer bg-white rounded-xl p-5 border transition-all duration-300 hover:border-blue-400 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-blue-50 group-hover:bg-blue-100 transition">
                <FaUniversity size={22} className="text-teal-600" />
              </div>
              <span className="text-xs text-slate-400">Module</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">School Management</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-3">Register, activate or deactivate schools</p>
            <div className="text-sm font-medium text-blue-600">Open Module →</div>
          </div>
        </div>
      </div>

      {recentClients.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Recently Added Schools</h2>
          <div className="bg-white rounded-xl border overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-5 py-3 text-left text-sm font-medium text-slate-600">Name</th>
                  <th className="px-5 py-3 text-left text-sm font-medium text-slate-600">Plan</th>
                  <th className="px-5 py-3 text-left text-sm font-medium text-slate-600">Students</th>
                  <th className="px-5 py-3 text-left text-sm font-medium text-slate-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentClients.map((c) => (
                  <tr key={c._id} className="border-t hover:bg-slate-50">
                    <td className="px-5 py-3 font-medium text-slate-800">{c.name}</td>
                    <td className="px-5 py-3 text-slate-600">{c.plan?.planName || "—"}</td>
                    <td className="px-5 py-3 text-slate-600 font-semibold">{c.students || 0}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${c.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminDashboard;
