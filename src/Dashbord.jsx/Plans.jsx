import React, { useState, useEffect } from "react";
import {
  FaPlus, FaEdit, FaTrash, FaCheck, FaGem, FaEye,
  FaTable, FaThLarge, FaRupeeSign, FaBuilding,
} from "react-icons/fa";
import Swal from "sweetalert2";
import { useNavigate, useLocation } from "react-router-dom";
import AddPlan from "./AddPlan";
import api from "../api";

const ITEMS_PER_PAGE = 6;

const Plans = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [viewMode, setViewMode] = useState("table");
  const [page, setPage] = useState(1);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/api/super-admin/reports/plans");
      setPlans(data.plans || []);
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Failed to load plans", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPlans(); }, []);

  // Agar edit state ke saath wapas aaye (PlanDetail se)
  useEffect(() => {
    if (location.state?.editId) {
      const found = plans.find((p) => p._id === location.state.editId);
      if (found) { setEditingPlan(found); setShowAddForm(true); }
      window.history.replaceState({}, "");
    }
  }, [location.state, plans]);

  const handleAddPlan = async (planData) => {
    try {
      if (editingPlan) {
        await api.put(`/api/plan/update/${editingPlan._id}`, planData);
        Swal.fire({ icon: "success", title: "Plan Updated", timer: 1500, showConfirmButton: false });
      } else {
        await api.post("/api/plan/create", planData);
        Swal.fire({ icon: "success", title: "Plan Created", timer: 1500, showConfirmButton: false });
      }
      fetchPlans();
      setShowAddForm(false);
      setEditingPlan(null);
      setPage(1);
    } catch (err) {
      const msg = err.response?.data?.message || "Operation failed";
      const detail = err.response?.data?.errors?.join(", ") || "";
      Swal.fire("Error", detail ? `${msg}: ${detail}` : msg, "error");
    }
  };

  const handleDelete = (plan) => {
    Swal.fire({
      title: `Delete "${plan.planName}"?`,
      text: "This cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
    }).then(async (res) => {
      if (res.isConfirmed) {
        try {
          await api.delete(`/api/plan/delete/${plan._id}`);
          setPlans((prev) => prev.filter((p) => p._id !== plan._id));
          Swal.fire({ icon: "success", title: "Deleted", timer: 1200, showConfirmButton: false });
        } catch (err) {
          Swal.fire("Error", err.response?.data?.message || "Delete failed", "error");
        }
      }
    });
  };

  if (showAddForm) {
    return (
      <AddPlan
        onBack={() => { setShowAddForm(false); setEditingPlan(null); }}
        onSubmit={handleAddPlan}
        editData={editingPlan}
        isEdit={!!editingPlan}
      />
    );
  }

  // Pagination
  const totalPages = Math.ceil(plans.length / ITEMS_PER_PAGE);
  const paginated = plans.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const priceText = (plan) =>
    plan.planType === "Per Student Basis"
      ? `₹${plan.pricePerStudent} / student`
      : plan.planType === "Monthly Fixed Price"
      ? `₹${plan.monthlyPrice} / month`
      : `₹${plan.yearlyPrice} / year`;

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-48 bg-slate-200 rounded-xl animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => <div key={i} className="h-48 bg-slate-200 rounded-2xl animate-pulse"></div>)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <FaGem className="text-purple-600" /> Plans
          <span className="text-lg text-slate-400 font-normal ml-2">({plans.length})</span>
        </h1>
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex bg-slate-100 rounded-xl p-1">
            <button
              onClick={() => setViewMode("card")}
              className={`px-4 py-2 rounded-lg text-sm transition ${viewMode === "card" ? "bg-white shadow text-purple-600" : "text-slate-600"}`}
            >
              <FaThLarge />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`px-4 py-2 rounded-lg text-sm transition ${viewMode === "table" ? "bg-white shadow text-purple-600" : "text-slate-600"}`}
            >
              <FaTable />
            </button>
          </div>
          <button
            onClick={() => { setShowAddForm(true); setEditingPlan(null); }}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-blue-700 transition shadow"
          >
            <FaPlus /> Create Plan
          </button>
        </div>
      </div>

      {plans.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <FaGem size={40} className="mx-auto mb-3 opacity-30" />
          <p>No plans yet. Create your first plan.</p>
        </div>
      ) : (
        <>
          {/* ── CARD VIEW ── */}
          {viewMode === "card" && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {paginated.map((plan) => (
                <div key={plan._id} className="bg-white rounded-2xl shadow-lg border p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                        <FaGem className="text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800 text-base">{plan.planName}</h3>
                        <p className="text-xs text-slate-500">{plan.planType}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${plan.status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {plan.status ? "Active" : "Inactive"}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2 text-purple-600 font-bold text-lg mb-2">
                    <FaRupeeSign className="text-sm" />
                    <span>{priceText(plan).replace("₹", "")}</span>
                  </div>

                  {/* Max Branches */}
                  <div className="flex items-center gap-2 text-slate-500 text-xs mb-3">
                    <FaBuilding /> Max Branches: <span className="font-semibold text-slate-700">{plan.maxBranches || "Unlimited"}</span>
                  </div>

                  {/* Schools & Students */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="bg-blue-50 p-2 rounded-lg text-center">
                      <p className="text-xs text-slate-500">Schools</p>
                      <p className="font-bold text-blue-600">{plan.clientCount || 0}</p>
                    </div>
                    <div className="bg-green-50 p-2 rounded-lg text-center">
                      <p className="text-xs text-slate-500">Students</p>
                      <p className="font-bold text-green-600">{plan.totalStudents || 0}</p>
                    </div>
                  </div>

                  {/* Panels */}
                  <div className="space-y-1 text-sm mb-4">
                    {(plan.panelsIncluded || []).slice(0, 4).map((m) => (
                      <div key={m} className="flex items-center gap-2 text-slate-600">
                        <FaCheck className="text-green-500 text-xs flex-shrink-0" />
                        <span className="capitalize">{m}</span>
                      </div>
                    ))}
                    {(plan.panelsIncluded || []).length > 4 && (
                      <p className="text-xs text-slate-400 pl-4">+{plan.panelsIncluded.length - 4} more panels</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-3 border-t">
                    <button
                      onClick={() => navigate(`/dashbord/plans/${plan._id}`)}
                      className="flex-1 flex items-center justify-center gap-1 py-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition text-sm font-medium"
                    >
                      <FaEye /> View
                    </button>
                    <button
                      onClick={() => { setEditingPlan(plan); setShowAddForm(true); }}
                      className="flex-1 flex items-center justify-center gap-1 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition text-sm font-medium"
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(plan)}
                      className="flex-1 flex items-center justify-center gap-1 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition text-sm font-medium"
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── TABLE VIEW ── */}
          {viewMode === "table" && (
            <div className="bg-white rounded-2xl shadow border overflow-x-auto">
              <table className="min-w-[800px] w-full">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">Plan Name</th>
                    <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">Type</th>
                    <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">Price</th>
                    <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">Max Branches</th>
                    <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">Schools</th>
                    <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">Students</th>
                    <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">Panels</th>
                    <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">Status</th>
                    <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((plan, i) => (
                    <tr key={plan._id} className={`border-t hover:bg-slate-50 ${i % 2 === 0 ? "bg-white" : "bg-slate-50/30"}`}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FaGem className="text-purple-600 text-xs" />
                          </div>
                          <span className="font-semibold text-slate-800">{plan.planName}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600">{plan.planType}</td>
                      <td className="px-5 py-4 text-sm font-semibold text-purple-600">{priceText(plan)}</td>
                      <td className="px-5 py-4 text-sm text-slate-600">{plan.maxBranches || "Unlimited"}</td>
                      <td className="px-5 py-4 text-sm font-semibold text-blue-600">{plan.clientCount || 0}</td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-1">
                          {(plan.panelsIncluded || []).slice(0, 3).map((p) => (
                            <span key={p} className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs capitalize">{p}</span>
                          ))}
                          {(plan.panelsIncluded || []).length > 3 && (
                            <span className="text-xs text-slate-400">+{plan.panelsIncluded.length - 3}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${plan.status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                          {plan.status ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          <button onClick={() => navigate(`/dashbord/plans/${plan._id}`)} className="p-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200" title="View">
                            <FaEye />
                          </button>
                          <button onClick={() => { setEditingPlan(plan); setShowAddForm(true); }} className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200" title="Edit">
                            <FaEdit />
                          </button>
                          <button onClick={() => handleDelete(plan)} className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200" title="Delete">
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ── PAGINATION ── */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(1)}
                className="px-3 py-2 border rounded-lg text-sm disabled:opacity-40 hover:bg-slate-50 transition"
              >
                «
              </button>
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-4 py-2 border rounded-lg text-sm disabled:opacity-40 hover:bg-slate-50 transition"
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    p === page
                      ? "bg-blue-600 text-white shadow"
                      : "border hover:bg-slate-50 text-slate-600"
                  }`}
                >
                  {p}
                </button>
              ))}

              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="px-4 py-2 border rounded-lg text-sm disabled:opacity-40 hover:bg-slate-50 transition"
              >
                Next
              </button>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(totalPages)}
                className="px-3 py-2 border rounded-lg text-sm disabled:opacity-40 hover:bg-slate-50 transition"
              >
                »
              </button>
            </div>
          )}

          {/* Page info */}
          <p className="text-center text-xs text-slate-400">
            Showing {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, plans.length)} of {plans.length} plans
          </p>
        </>
      )}
    </div>
  );
};

export default Plans;
