import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaArrowLeft, FaGem, FaCheck, FaBuilding, FaRupeeSign,
  FaCalendarAlt, FaToggleOn, FaToggleOff, FaEdit, FaUsers,
} from "react-icons/fa";
import Swal from "sweetalert2";
import api from "../api";

export default function PlanDetail() {
  const { planId } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [clientCount, setClientCount] = useState(null);
  const [totalStudents, setTotalStudents] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const [planRes, plansReportRes] = await Promise.all([
          api.get(`/api/plan/${planId}`),
          api.get("/api/super-admin/reports/plans"),
        ]);
        setPlan(planRes.data.plan);
        const found = plansReportRes.data.plans?.find((p) => p._id === planId);
        if (found) {
          setClientCount({ total: found.clientCount, active: found.activeClientCount });
          setTotalStudents(found.totalStudents || 0);
        }
      } catch (err) {
        Swal.fire("Error", err.response?.data?.message || "Failed to load plan", "error");
        navigate("/dashbord/plans");
      } finally {
        setLoading(false);
      }
    };
    fetchPlan();
  }, [planId]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-48 bg-slate-200 rounded-xl animate-pulse"></div>
        <div className="h-40 bg-slate-200 rounded-2xl animate-pulse"></div>
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-20 bg-slate-200 rounded-xl animate-pulse"></div>)}
        </div>
      </div>
    );
  }

  if (!plan) return null;

  const priceLabel =
    plan.planType === "Per Student Basis"
      ? `₹${plan.pricePerStudent} / student`
      : plan.planType === "Monthly Fixed Price"
      ? `₹${plan.monthlyPrice} / month`
      : `₹${plan.yearlyPrice} / year`;

  return (
    <div className="space-y-6">
      {/* Back */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate("/dashbord/plans")} className="p-2 hover:bg-slate-100 rounded-xl transition">
          <FaArrowLeft className="text-slate-600 text-lg" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{plan.planName}</h1>
          <p className="text-slate-500 text-sm">Plan Details</p>
        </div>
      </div>

      {/* Top Card */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <FaGem className="text-white text-3xl" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{plan.planName}</h2>
              <p className="text-purple-100 text-sm mt-1">{plan.planType}</p>
              <p className="text-white font-semibold text-lg mt-1">{priceLabel}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${plan.status ? "bg-green-400/30 text-green-100" : "bg-red-400/30 text-red-100"}`}>
              {plan.status ? "● Active" : "● Inactive"}
            </span>
            <button
              onClick={() => navigate("/dashbord/plans", { state: { editId: planId } })}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition text-sm font-medium"
            >
              <FaEdit /> Edit
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-xs mb-2"><FaRupeeSign className="text-purple-500" /> Pricing</div>
          <p className="font-bold text-slate-800 text-lg">{priceLabel}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-xs mb-2"><FaBuilding className="text-orange-500" /> Max Branches</div>
          <p className="font-bold text-slate-800 text-lg">{plan.maxBranches || "Unlimited"}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-xs mb-2"><FaUsers className="text-blue-500" /> Schools Using</div>
          <p className="font-bold text-slate-800 text-lg">
            {clientCount !== null ? `${clientCount.total} total (${clientCount.active} active)` : "—"}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-5 border shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-xs mb-2"><FaUsers className="text-green-500" /> Total Students</div>
          <p className="font-bold text-slate-800 text-lg">{totalStudents.toLocaleString()}</p>
        </div>
      </div>

      {/* Panels Included */}
      <div className="bg-white rounded-2xl p-6 border shadow-sm">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <FaCheck className="text-green-500" /> Panels Included ({plan.panelsIncluded?.length || 0})
        </h3>
        {plan.panelsIncluded?.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {plan.panelsIncluded.map((panel) => (
              <div key={panel} className="flex items-center gap-3 bg-green-50 border border-green-200 p-3 rounded-xl">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <FaCheck className="text-white text-xs" />
                </div>
                <span className="font-medium text-slate-700 capitalize text-sm">{panel}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-400 text-sm">No panels included</p>
        )}
      </div>

      {/* Timestamps */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-5 border shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-xs mb-1"><FaCalendarAlt /> Created At</div>
          <p className="font-semibold text-slate-800 text-sm">
            {plan.createdAt ? new Date(plan.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "—"}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-5 border shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-xs mb-1"><FaCalendarAlt /> Last Updated</div>
          <p className="font-semibold text-slate-800 text-sm">
            {plan.updatedAt ? new Date(plan.updatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "—"}
          </p>
        </div>
      </div>
    </div>
  );
}
