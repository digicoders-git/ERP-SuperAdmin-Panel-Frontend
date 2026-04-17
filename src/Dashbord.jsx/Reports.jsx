import React, { useState, useEffect } from "react";
import {
  FaChartBar, FaUsers, FaSchool, FaGem, FaCalendarAlt,
  FaDownload, FaFilter, FaArrowUp, FaMoneyBillWave,
  FaChartLine, FaChartPie, FaSpinner,
} from "react-icons/fa";
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, Title, Tooltip, Legend, ArcElement,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import api from "../api";

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, Title, Tooltip, Legend, ArcElement
);

const COLORS = [
  "rgba(59,130,246,0.8)", "rgba(147,51,234,0.8)",
  "rgba(34,197,94,0.8)", "rgba(249,115,22,0.8)",
  "rgba(20,184,166,0.8)", "rgba(239,68,68,0.8)",
];

const Reports = () => {
  const [period, setPeriod] = useState("monthly");
  const [overview, setOverview] = useState(null);
  const [plansReport, setPlansReport] = useState(null);
  const [revenueReport, setRevenueReport] = useState(null);
  const [growthData, setGrowthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAll();
  }, [period]);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [overviewRes, plansRes, revenueRes, growthRes] = await Promise.all([
        api.get("/api/super-admin/reports/system-overview"),
        api.get("/api/super-admin/reports/plans"),
        api.get("/api/super-admin/reports/revenue"),
        api.get(`/api/super-admin/reports/growth-analytics?period=${period}`),
      ]);
      
      console.log('Overview Response:', overviewRes.data);
      console.log('Recent Activity:', overviewRes.data?.recentActivity);
      
      setOverview(overviewRes.data || {});
      setPlansReport(plansRes.data || {});
      setRevenueReport(revenueRes.data || {});
      setGrowthData(growthRes.data || {});
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Failed to fetch reports";
      console.error("Reports fetch error:", errorMsg);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // ── Chart: Client Growth (from growthAnalytics) ──
  const clientGrowthChart = {
    labels: growthData?.clientGrowth?.map((d) => d._id) || [],
    datasets: [
      {
        label: "New Schools",
        data: growthData?.clientGrowth?.map((d) => d.count) || [],
        backgroundColor: "rgba(34,197,94,0.8)",
        borderColor: "rgb(34,197,94)",
        borderWidth: 1,
      },
    ],
  };

  // ── Chart: Student Growth (from growthAnalytics) ──
  const studentGrowthChart = {
    labels: growthData?.clientGrowth?.map((d) => d._id) || [],
    datasets: [
      {
        label: "Total Students",
        data: growthData?.clientGrowth?.map((d) => d.totalStudents) || [],
        borderColor: "rgb(59,130,246)",
        backgroundColor: "rgba(59,130,246,0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // ── Chart: Plan Distribution (from plansReport) ──
  const planDistChart = {
    labels: plansReport?.plans?.map((p) => p.planName) || [],
    datasets: [
      {
        data: plansReport?.plans?.map((p) => p.clientCount) || [],
        backgroundColor: COLORS,
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "top" } },
    scales: { y: { beginAtZero: true } },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "bottom" } },
  };

  const ov = overview?.overview || {};

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FaSpinner className="animate-spin text-blue-500 text-4xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
        <p className="text-red-600 font-medium">Error loading reports</p>
        <p className="text-red-500 text-sm mt-2">{error}</p>
        <button
          onClick={fetchAll}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
            <FaChartBar className="text-blue-600" /> Reports & Analytics
          </h1>
          <p className="text-slate-600 mt-1">Live data from backend</p>
        </div>
        <div className="flex gap-3">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
          <button
            onClick={fetchAll}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-5 py-2 rounded-xl flex items-center gap-2 shadow hover:shadow-lg transition"
          >
            <FaDownload /> Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-5 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Schools</p>
              <p className="text-2xl font-bold">{ov?.totalClients ?? 0}</p>
            </div>
            <FaSchool className="text-3xl text-blue-200" />
          </div>
          <p className="text-xs text-blue-100 mt-2">
            Active: {ov?.activeClients ?? 0} | Inactive: {ov?.inactiveClients ?? 0}
          </p>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-5 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Total Students</p>
              <p className="text-2xl font-bold">{(ov?.totalStudents ?? 0).toLocaleString()}</p>
            </div>
            <FaUsers className="text-3xl text-green-200" />
          </div>
          <p className="text-xs text-green-100 mt-2">Across all schools</p>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-5 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Total Plans</p>
              <p className="text-2xl font-bold">{ov?.totalPlans ?? 0}</p>
            </div>
            <FaGem className="text-3xl text-purple-200" />
          </div>
          <p className="text-xs text-purple-100 mt-2">Total Branches: {ov?.totalBranches ?? 0}</p>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-5 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold">
                ₹{revenueReport?.totalRevenue
                  ? (revenueReport.totalRevenue >= 100000 
                      ? (revenueReport.totalRevenue / 100000).toFixed(1) + "L"
                      : (revenueReport.totalRevenue / 1000).toFixed(1) + "K")
                  : "0"}
              </p>
            </div>
            <FaMoneyBillWave className="text-3xl text-orange-200" />
          </div>
          <p className="text-xs text-orange-100 mt-2">
            From {revenueReport?.totalClients ?? 0} clients
          </p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student Growth Line Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <FaChartLine className="text-blue-500" /> Student Growth
          </h3>
          <div className="h-64">
            {studentGrowthChart.labels.length > 0 ? (
              <Line data={studentGrowthChart} options={chartOptions} />
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400">No data available</div>
            )}
          </div>
        </div>

        {/* School Growth Bar Chart */}
        <div className="bg-white rounded-2xl shadow-lg border p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <FaChartBar className="text-green-500" /> School Growth
          </h3>
          <div className="h-64">
            {clientGrowthChart.labels.length > 0 ? (
              <Bar data={clientGrowthChart} options={chartOptions} />
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400">No data available</div>
            )}
          </div>
        </div>
      </div>

      {/* Plan Distribution + Revenue by Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Doughnut */}
        <div className="bg-white rounded-2xl shadow-lg border p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <FaChartPie className="text-purple-500" /> Plan Distribution
          </h3>
          <div className="h-64">
            {planDistChart.labels.length > 0 ? (
              <Doughnut data={planDistChart} options={doughnutOptions} />
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400">No plans data</div>
            )}
          </div>
        </div>

        {/* Revenue by Plan */}
        <div className="bg-white rounded-2xl shadow-lg border p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <FaMoneyBillWave className="text-orange-500" /> Revenue by Plan
          </h3>
          <div className="space-y-3 overflow-y-auto max-h-64">
            {revenueReport?.revenueByPlan && Array.isArray(revenueReport.revenueByPlan) && revenueReport.revenueByPlan.length > 0 ? (
              revenueReport.revenueByPlan.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length].replace("0.8", "1") }}></div>
                    <div>
                      <p className="font-medium text-slate-800 text-sm">{item.planName || "Unknown"}</p>
                      <p className="text-xs text-slate-500">{item.clientCount || 0} schools</p>
                    </div>
                  </div>
                  <p className="font-bold text-green-600">₹{(item.revenue || 0).toLocaleString()}</p>
                </div>
              ))
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 py-10">No revenue data</div>
            )}
          </div>
        </div>
      </div>

      {/* Plans Performance Table */}
      <div className="bg-white rounded-2xl shadow-lg border p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <FaGem className="text-purple-500" /> Plans Performance
        </h3>
        {plansReport?.plans && Array.isArray(plansReport.plans) && plansReport.plans.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">Plan Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">Type</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">Total Schools</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">Active Schools</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {plansReport.plans.map((plan, i) => (
                  <tr key={i} className="border-t hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-800">{plan.planName || "Unknown"}</td>
                    <td className="px-4 py-3 text-slate-600 text-sm">{plan.planType || "N/A"}</td>
                    <td className="px-4 py-3 text-slate-800">{plan.clientCount || 0}</td>
                    <td className="px-4 py-3 text-slate-800">{plan.activeClientCount || 0}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${plan.status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {plan.status ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-slate-400 text-center py-8">No plans data</p>
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-lg border p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <FaCalendarAlt className="text-blue-500" /> Recently Added Schools
        </h3>
        {overview?.recentActivity && Array.isArray(overview.recentActivity) && overview.recentActivity.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">School Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">Plan</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">Students</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {overview.recentActivity.map((client, i) => (
                  <tr key={i} className="border-t hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-800">{client.name || "Unknown"}</td>
                    <td className="px-4 py-3 text-slate-600 text-sm">{client.plan?.planName || "No Plan"}</td>
                    <td className="px-4 py-3 font-semibold text-blue-600">{client.students || 0}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${client.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {client.status || "Unknown"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-slate-400 text-center py-8">No recent activity</p>
        )}
      </div>
    </div>
  );
};

export default Reports;
