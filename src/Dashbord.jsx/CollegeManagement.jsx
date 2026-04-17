import React, { useState, useEffect } from "react";
import {
  FaPlus, FaEdit, FaToggleOn, FaToggleOff, FaEye,
  FaSchool, FaTable, FaThLarge, FaUsers, FaStar, FaTrash, FaGraduationCap,
} from "react-icons/fa";
import Swal from "sweetalert2";
import { useNavigate, useLocation } from "react-router-dom";
import AddSchool from "./AddSchool";
import api from "../api";

const CollegeManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [schools, setSchools] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSchool, setEditingSchool] = useState(null);
  const [viewMode, setViewMode] = useState("table");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [clientsRes, plansRes] = await Promise.all([
        api.get(`/api/client/all?page=${page}&limit=10&search=${search}`),
        api.get("/api/plan/all"),
      ]);
      setSchools(clientsRes.data.clients || []);
      setTotalPages(clientsRes.data.pagination?.totalPages || 1);
      setPlans(plansRes.data.plans || []);
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [page, search]);

  // Agar edit state ke saath wapas aaye (SchoolDetail se)
  useEffect(() => {
    if (location.state?.editId) {
      handleEdit({ _id: location.state.editId });
      window.history.replaceState({}, "");
    }
  }, [location.state]);

  const handleAddSchool = async (schoolData) => {
    try {
      if (editingSchool) {
        await api.put(`/api/client/update/${editingSchool._id}`, schoolData);
        Swal.fire({ icon: "success", title: "School Updated", timer: 1500, showConfirmButton: false });
      } else {
        await api.post("/api/client/create", schoolData);
        Swal.fire({ icon: "success", title: "School Created", timer: 1500, showConfirmButton: false });
      }
      fetchData();
      setShowAddForm(false);
      setEditingSchool(null);
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Operation failed", "error");
    }
  };

  const handleDelete = (school) => {
    Swal.fire({
      title: `Delete "${school.name}"?`,
      text: "This will also delete the associated admin.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
    }).then(async (res) => {
      if (res.isConfirmed) {
        try {
          await api.delete(`/api/client/delete/${school._id}`);
          setSchools(schools.filter((s) => s._id !== school._id));
          Swal.fire({ icon: "success", title: "Deleted", timer: 1200, showConfirmButton: false });
        } catch (err) {
          Swal.fire("Error", err.response?.data?.message || "Delete failed", "error");
        }
      }
    });
  };

  const toggleStatus = async (school) => {
    try {
      const { data } = await api.put(`/api/client/toggle-status/${school._id}`);
      setSchools(schools.map((s) => s._id === school._id ? { ...s, status: data.status } : s));
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Status update failed", "error");
    }
  };

  const handleEdit = async (school) => {
    try {
      const { data } = await api.get(`/api/client/${school._id}`);
      setEditingSchool({ ...data.client, adminEmail: data.admin?.email || "" });
    } catch {
      setEditingSchool(school);
    }
    setShowAddForm(true);
  };

  if (showAddForm) {
    return (
      <AddSchool
        onBack={() => { setShowAddForm(false); setEditingSchool(null); }}
        onSubmit={handleAddSchool}
        editData={editingSchool}
        isEdit={!!editingSchool}
        availablePlans={plans}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
            <FaSchool /> School Management
          </h1>
          <p className="text-slate-600 text-sm mt-1 flex items-center gap-2">
            <FaGraduationCap /> Manage schools easily
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search schools..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
          />
          <div className="flex bg-slate-100 rounded-xl p-1">
            <button onClick={() => setViewMode("grid")} className={`px-4 py-2 rounded-lg text-sm ${viewMode === "grid" ? "bg-white shadow text-blue-600" : "text-slate-600"}`}>
              <FaThLarge />
            </button>
            <button onClick={() => setViewMode("table")} className={`px-4 py-2 rounded-lg text-sm ${viewMode === "table" ? "bg-white shadow text-blue-600" : "text-slate-600"}`}>
              <FaTable />
            </button>
          </div>
          {plans.length === 0 ? (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2 text-red-600 text-sm">
              ⚠️ Create a plan first
            </div>
          ) : (
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-5 py-2 rounded-xl flex items-center gap-2 shadow hover:shadow-lg transition"
            >
              <FaPlus /> Add School
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <div key={i} className="h-14 bg-slate-200 rounded-xl animate-pulse"></div>)}
        </div>
      ) : schools.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <FaSchool size={40} className="mx-auto mb-3 opacity-30" />
          <p>No schools found.</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {schools.map((school) => (
            <div key={school._id} className="bg-white rounded-2xl p-5 border hover:border-blue-400 hover:shadow-xl transition">
              <div className="flex justify-between mb-3">
                <div className="p-3 rounded-xl bg-blue-50"><FaSchool className="text-blue-600" /></div>
                <span className={`px-3 py-1 text-xs rounded-full ${school.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {school.status}
                </span>
              </div>
              <h3 className="font-semibold text-lg text-slate-800">{school.name}</h3>
              <div className="mt-3 space-y-1 text-sm text-slate-600">
                <div className="flex items-center gap-2"><FaUsers /> {school.students || 0} Students</div>
                <div className="flex items-center gap-2"><FaStar className="text-yellow-500" /> {school.rating || "N/A"}</div>
              </div>
              <div className="flex justify-between items-center mt-4 pt-4 border-t">
                <button onClick={() => toggleStatus(school)} className="flex items-center gap-2 text-sm px-3 py-2 bg-slate-100 rounded-lg hover:bg-slate-200">
                  {school.status === "active" ? <FaToggleOn className="text-green-600" /> : <FaToggleOff className="text-red-600" />} Status
                </button>
                <div className="flex gap-2">
                  <button onClick={() => navigate(`/dashbord/college-management/${school._id}`)} className="p-2 bg-emerald-100 rounded-lg text-emerald-600 hover:bg-emerald-200" title="View Details">
                    <FaEye />
                  </button>
                  <button onClick={() => handleEdit(school)} className="p-2 bg-blue-100 rounded-lg text-blue-600 hover:bg-blue-200" title="Edit">
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(school)} className="p-2 bg-red-100 rounded-lg text-red-600 hover:bg-red-200" title="Delete">
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow border overflow-x-auto">
          <table className="min-w-[900px] w-full">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm">School</th>
                <th className="px-6 py-4 text-left text-sm">Phone</th>
                <th className="px-6 py-4 text-left text-sm">Plan</th>
                <th className="px-6 py-4 text-left text-sm">Students</th>
                <th className="px-6 py-4 text-left text-sm">Status</th>
                <th className="px-6 py-4 text-left text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {schools.map((school) => (
                <tr key={school._id} className="border-t hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium">{school.name}</td>
                  <td className="px-6 py-4">{school.phone || "—"}</td>
                  <td className="px-6 py-4">{school.plan?.planName || "—"}</td>
                  <td className="px-6 py-4">{school.students || 0}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${school.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {school.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => toggleStatus(school)} className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200" title="Toggle Status">
                        {school.status === "active" ? <FaToggleOn className="text-green-600" /> : <FaToggleOff className="text-red-600" />}
                      </button>
                      <button onClick={() => navigate(`/dashbord/college-management/${school._id}`)} className="p-2 bg-emerald-100 rounded-lg text-emerald-600 hover:bg-emerald-200" title="View Details">
                        <FaEye />
                      </button>
                      <button onClick={() => handleEdit(school)} className="p-2 bg-blue-100 rounded-lg text-blue-600 hover:bg-blue-200" title="Edit">
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDelete(school)} className="p-2 bg-red-100 rounded-lg text-red-600 hover:bg-red-200" title="Delete">
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

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-4 py-2 border rounded-lg disabled:opacity-40 hover:bg-slate-50">Prev</button>
          <span className="px-4 py-2 text-sm text-slate-600">{page} / {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="px-4 py-2 border rounded-lg disabled:opacity-40 hover:bg-slate-50">Next</button>
        </div>
      )}
    </div>
  );
};

export default CollegeManagement;
