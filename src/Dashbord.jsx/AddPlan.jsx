import React, { useState } from "react";
import { FaArrowLeft, FaGem, FaCheck } from "react-icons/fa";

const VALID_PANELS = ['school', 'staff', 'fee', 'warden', 'library', 'transport', 'teacher', 'parent', 'student'];

const PANELS = [
  "school", "fee", "teacher", "staff", "transport",
  "warden", "library", "parent", "student",
];

function AddPlan({ onBack, onSubmit, editData, isEdit }) {
  const [formData, setFormData] = useState({
    planName: editData?.planName || "",
    planType: editData?.planType || "Per Student Basis",
    pricePerStudent: editData?.pricePerStudent || "",
    monthlyPrice: editData?.monthlyPrice || "",
    yearlyPrice: editData?.yearlyPrice || "",
    panelsIncluded: editData?.panelsIncluded?.filter(p => VALID_PANELS.includes(p)) || [],
    maxBranches: editData?.maxBranches || "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.planName.trim()) errs.planName = "Plan name is required";
    if (formData.planType === "Per Student Basis" && !formData.pricePerStudent)
      errs.price = "Price per student is required";
    if (formData.planType === "Monthly Fixed Price" && !formData.monthlyPrice)
      errs.price = "Monthly price is required";
    if (formData.planType === "Yearly Fixed Price" && !formData.yearlyPrice)
      errs.price = "Yearly price is required";
    if (formData.panelsIncluded.length === 0)
      errs.panels = "Select at least one panel";
    if (formData.panelsIncluded.includes("school") && !formData.maxBranches)
      errs.maxBranches = "Max branches required when school panel is selected";
    return errs;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "", price: "" });
  };

  const togglePanel = (panel) => {
    setFormData((prev) => ({
      ...prev,
      panelsIncluded: prev.panelsIncluded.includes(panel)
        ? prev.panelsIncluded.filter((p) => p !== panel)
        : [...prev.panelsIncluded, panel],
    }));
    setErrors({ ...errors, panels: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);

    setSubmitting(true);
    const payload = {
      planName: formData.planName,
      planType: formData.planType,
      pricePerStudent: formData.planType === "Per Student Basis" ? Number(formData.pricePerStudent) : 0,
      monthlyPrice: formData.planType === "Monthly Fixed Price" ? Number(formData.monthlyPrice) : 0,
      yearlyPrice: formData.planType === "Yearly Fixed Price" ? Number(formData.yearlyPrice) : 0,
      panelsIncluded: formData.panelsIncluded.filter(p => VALID_PANELS.includes(p)),
      maxBranches: formData.panelsIncluded.includes("school") ? Number(formData.maxBranches) : 0,
    };
    await onSubmit(payload);
    setSubmitting(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg transition">
          <FaArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
            <FaGem className="text-blue-600" />
            {isEdit ? "Edit Plan" : "Add New Plan"}
          </h1>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Plan Info */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-100">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Plan Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Plan Name *</label>
                <input
                  type="text"
                  name="planName"
                  placeholder="e.g., Premium Plan"
                  value={formData.planName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-blue-500 transition bg-white ${errors.planName ? "border-red-400" : "border-slate-200"}`}
                />
                {errors.planName && <p className="text-red-500 text-xs mt-1">{errors.planName}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Plan Type *</label>
                <select
                  name="planType"
                  value={formData.planType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 bg-white"
                >
                  <option value="Per Student Basis">Per Student Basis</option>
                  <option value="Monthly Fixed Price">Monthly Fixed Price</option>
                  <option value="Yearly Fixed Price">Yearly Fixed Price</option>
                </select>
              </div>

              {formData.planType === "Per Student Basis" && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Price Per Student (₹) *</label>
                  <input
                    type="number"
                    name="pricePerStudent"
                    placeholder="e.g., 10"
                    value={formData.pricePerStudent}
                    onChange={handleChange}
                    min="1"
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-blue-500 bg-white ${errors.price ? "border-red-400" : "border-slate-200"}`}
                  />
                  {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                </div>
              )}
              {formData.planType === "Monthly Fixed Price" && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Monthly Price (₹) *</label>
                  <input
                    type="number"
                    name="monthlyPrice"
                    placeholder="e.g., 999"
                    value={formData.monthlyPrice}
                    onChange={handleChange}
                    min="1"
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-blue-500 bg-white ${errors.price ? "border-red-400" : "border-slate-200"}`}
                  />
                  {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                </div>
              )}
              {formData.planType === "Yearly Fixed Price" && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Yearly Price (₹) *</label>
                  <input
                    type="number"
                    name="yearlyPrice"
                    placeholder="e.g., 9999"
                    value={formData.yearlyPrice}
                    onChange={handleChange}
                    min="1"
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-blue-500 bg-white ${errors.price ? "border-red-400" : "border-slate-200"}`}
                  />
                  {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                </div>
              )}

              {formData.panelsIncluded.includes("school") && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Max Branches *</label>
                  <input
                    type="number"
                    name="maxBranches"
                    placeholder="e.g., 5"
                    value={formData.maxBranches}
                    onChange={handleChange}
                    min="1"
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-blue-500 bg-white ${errors.maxBranches ? "border-red-400" : "border-slate-200"}`}
                  />
                  {errors.maxBranches && <p className="text-red-500 text-xs mt-1">{errors.maxBranches}</p>}
                </div>
              )}
            </div>
          </div>

          {/* Panels Selection */}
          <div className="bg-gradient-to-r from-green-50 to-teal-50 p-6 rounded-xl border border-green-100">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Select Panels *</h3>
            {errors.panels && <p className="text-red-500 text-xs mb-3">{errors.panels}</p>}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {PANELS.map((panel) => (
                <div
                  key={panel}
                  onClick={() => togglePanel(panel)}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition-all capitalize ${
                    formData.panelsIncluded.includes(panel)
                      ? "border-green-500 bg-green-50 shadow"
                      : "border-slate-200 bg-white hover:border-green-300"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      formData.panelsIncluded.includes(panel) ? "border-green-500 bg-green-500" : "border-slate-300"
                    }`}>
                      {formData.panelsIncluded.includes(panel) && <FaCheck className="text-white text-xs" />}
                    </div>
                    <span className="font-medium text-slate-700 text-sm">{panel}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t">
            <button type="button" onClick={onBack} className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition font-medium">
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition font-medium shadow-lg disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {submitting ? "Saving..." : isEdit ? "Update Plan" : "Create Plan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddPlan;
