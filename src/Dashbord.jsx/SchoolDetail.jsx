import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaArrowLeft, FaSchool, FaPhone, FaMapMarkerAlt, FaEnvelope,
  FaBuilding, FaCalendarAlt, FaUserTie, FaUsers, FaStar, FaEdit,
  FaToggleOn, FaToggleOff,
} from "react-icons/fa";
import Swal from "sweetalert2";
import api from "../api";

export default function SchoolDetail() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [school, setSchool] = useState(null);
  const [adminEmail, setAdminEmail] = useState("");
  const [studentCount, setStudentCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const { data } = await api.get(`/api/client/${clientId}`);
        setSchool(data.client);
        setAdminEmail(data.admin?.email || "");
        
        // Fetch actual student count from database
        try {
          const studentRes = await api.get(`/api/client/all?page=1&limit=1&search=${data.client.name}`);
          const schoolData = studentRes.data.clients?.find(c => c._id === clientId);
          if (schoolData) {
            setStudentCount(schoolData.students || 0);
          }
        } catch (err) {
          console.error("Student count fetch error:", err);
        }
      } catch (err) {
        Swal.fire("Error", err.response?.data?.message || "Failed to load school", "error");
        navigate("/dashbord/college-management");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [clientId]);

  const toggleStatus = async () => {
    try {
      const { data } = await api.put(`/api/client/toggle-status/${clientId}`);
      setSchool((prev) => ({ ...prev, status: data.status }));
      Swal.fire({ icon: "success", title: `Status changed to ${data.status}`, timer: 1200, showConfirmButton: false });
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Status update failed", "error");
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 p-2">
        <div className="h-10 w-48 bg-slate-200 rounded-xl animate-pulse"></div>
        <div className="h-40 bg-slate-200 rounded-2xl animate-pulse"></div>
        <div className="grid grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="h-20 bg-slate-200 rounded-xl animate-pulse"></div>)}
        </div>
      </div>
    );
  }

  if (!school) return null;

  const infoCards = [
    { icon: <FaEnvelope className="text-blue-500" />, label: "Admin Email", value: adminEmail },
    { icon: <FaPhone className="text-purple-500" />, label: "Phone", value: school.phone },
    { icon: <FaUserTie className="text-indigo-500" />, label: "Principal", value: school.principal },
    { icon: <FaUsers className="text-green-500" />, label: "Total Students", value: studentCount },
    { icon: <FaBuilding className="text-orange-500" />, label: "Capacity", value: school.capacity },
    { icon: <FaCalendarAlt className="text-teal-500" />, label: "Established", value: school.established },
    { icon: <FaStar className="text-yellow-500" />, label: "Rating", value: school.rating || "N/A" },
    { icon: <FaBuilding className="text-rose-500" />, label: "Max Branches", value: school.maxBranches },
    { icon: <FaBuilding className="text-cyan-500" />, label: "Current Branches", value: school.currentBranchCount ?? 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Back + Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/dashbord/college-management")}
          className="p-2 hover:bg-slate-100 rounded-xl transition"
        >
          <FaArrowLeft className="text-slate-600 text-lg" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{school.name}</h1>
          <p className="text-slate-500 text-sm">School Details</p>
        </div>
      </div>

      {/* Top Card */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <FaSchool className="text-white text-3xl" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{school.name}</h2>
              <p className="text-blue-100 text-sm mt-1">
                Plan: <span className="font-semibold text-white">{school.plan?.planName || "—"}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${school.status === "active" ? "bg-green-400/30 text-green-100" : "bg-red-400/30 text-red-100"}`}>
              {school.status === "active" ? "● Active" : "● Inactive"}
            </span>
            <button
              onClick={toggleStatus}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition text-sm font-medium"
            >
              {school.status === "active" ? <FaToggleOn className="text-green-300 text-lg" /> : <FaToggleOff className="text-red-300 text-lg" />}
              Toggle
            </button>
            <button
              onClick={() => navigate("/dashbord/college-management", { state: { editId: clientId } })}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition text-sm font-medium"
            >
              <FaEdit /> Edit
            </button>
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {infoCards.map(({ icon, label, value }) => (
          <div key={label} className="bg-white rounded-2xl p-5 border shadow-sm hover:shadow-md transition">
            <div className="flex items-center gap-2 text-slate-500 text-xs mb-2">
              {icon} {label}
            </div>
            <p className="font-semibold text-slate-800">{value || "—"}</p>
          </div>
        ))}
      </div>

      {/* Address */}
      {school.address && (
        <div className="bg-white rounded-2xl p-5 border shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-xs mb-2">
            <FaMapMarkerAlt className="text-red-500" /> Address
          </div>
          <p className="font-semibold text-slate-800">{school.address}</p>
        </div>
      )}

      {/* Purchased Panels */}
      {school.purchasedPanels?.length > 0 && (
        <div className="bg-white rounded-2xl p-5 border shadow-sm">
          <p className="text-slate-500 text-xs mb-3">Purchased Panels</p>
          <div className="flex flex-wrap gap-2">
            {school.purchasedPanels.map((panel) => (
              <span key={panel} className="bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium capitalize">
                {panel}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Timestamps */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-5 border shadow-sm">
          <p className="text-slate-500 text-xs mb-1">Created At</p>
          <p className="font-semibold text-slate-800 text-sm">
            {school.createdAt ? new Date(school.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "—"}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-5 border shadow-sm">
          <p className="text-slate-500 text-xs mb-1">Last Updated</p>
          <p className="font-semibold text-slate-800 text-sm">
            {school.updatedAt ? new Date(school.updatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "—"}
          </p>
        </div>
      </div>
    </div>
  );
}
