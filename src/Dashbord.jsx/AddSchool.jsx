import React, { useState } from "react";
import {
  FaArrowLeft, FaSchool, FaEnvelope, FaPhone,
  FaMapMarkerAlt, FaGraduationCap, FaEye, FaEyeSlash,
} from "react-icons/fa";

function AddSchool({ onBack, onSubmit, editData, isEdit, availablePlans = [] }) {
  const [formData, setFormData] = useState({
    clientName: editData?.name || "",
    email: editData?.adminEmail || "",
    phone: editData?.phone || "",
    address: editData?.address || "",
    principal: editData?.principal || "",
    capacity: editData?.capacity || "",
    established: editData?.established || "",
    password: "",
    confirmPassword: "",
    planId: editData?.plan?._id || "",
    status: editData?.status || "active",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.clientName.trim()) errs.clientName = "School name is required";
    if (!formData.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = "Invalid email";
    if (!formData.phone.trim()) errs.phone = "Phone is required";
    else if (!/^\d{10}$/.test(formData.phone)) errs.phone = "Enter valid 10-digit phone";
    if (!formData.principal.trim()) errs.principal = "Principal name is required";
    if (!formData.address.trim()) errs.address = "Address is required";
    if (!formData.planId) errs.planId = "Select a plan";
    if (!isEdit) {
      if (!formData.password) errs.password = "Password is required";
      else if (formData.password.length < 6) errs.password = "Min 6 characters";
      if (formData.password !== formData.confirmPassword) errs.confirmPassword = "Passwords do not match";
    }
    return errs;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);

    setSubmitting(true);

    let payload;
    if (isEdit) {
      // Update: backend expects 'name' not 'clientName', no email change
      payload = {
        name: formData.clientName,
        phone: formData.phone,
        address: formData.address,
        principal: formData.principal,
        capacity: formData.capacity ? Number(formData.capacity) : undefined,
        established: formData.established || undefined,
        planId: formData.planId,
        status: formData.status,
        ...(formData.password && { password: formData.password }),
      };
    } else {
      // Create: backend expects 'clientName' + 'email' + 'password'
      payload = {
        clientName: formData.clientName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        principal: formData.principal,
        capacity: formData.capacity ? Number(formData.capacity) : undefined,
        established: formData.established || undefined,
        planId: formData.planId,
        status: formData.status,
        password: formData.password,
      };
    }

    await onSubmit(payload);
    setSubmitting(false);
  };

  const inputClass = (field) =>
    `w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-blue-500 transition bg-white ${errors[field] ? "border-red-400" : "border-slate-200"}`;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg transition">
          <FaArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
            <FaSchool className="text-blue-600" />
            {isEdit ? "Edit School" : "Add New School"}
          </h1>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-100">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <FaSchool className="text-blue-500" /> Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">School Name *</label>
                <input type="text" name="clientName" value={formData.clientName} onChange={handleChange} placeholder="ABC Public School" className={inputClass("clientName")} />
                {errors.clientName && <p className="text-red-500 text-xs mt-1">{errors.clientName}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1"><FaEnvelope className="text-green-500" /> Admin Email *</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="admin@school.edu" className={inputClass("email")} disabled={isEdit} />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1"><FaPhone className="text-purple-500" /> Phone *</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="9876543210" className={inputClass("phone")} />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1"><FaGraduationCap className="text-blue-500" /> Principal Name *</label>
                <input type="text" name="principal" value={formData.principal} onChange={handleChange} placeholder="Dr. John Smith" className={inputClass("principal")} />
                {errors.principal && <p className="text-red-500 text-xs mt-1">{errors.principal}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1"><FaMapMarkerAlt className="text-red-500" /> Address *</label>
                <textarea name="address" value={formData.address} onChange={handleChange} placeholder="Complete address" rows={3} className={`${inputClass("address")} resize-none`} />
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Established Year</label>
                <input type="number" name="established" value={formData.established} onChange={handleChange} placeholder="2020" min="1900" max="2030" className={inputClass("established")} />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Capacity</label>
                <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} placeholder="1000" min="1" className={inputClass("capacity")} />
              </div>
            </div>
          </div>

          {/* Security & Plan */}
          <div className="bg-gradient-to-r from-green-50 to-teal-50 p-6 rounded-xl border border-green-100">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Security & Plan</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {!isEdit && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Password *</label>
                    <div className="relative">
                      <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} placeholder="Min 6 characters" className={`${inputClass("password")} pr-12`} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Confirm Password *</label>
                    <div className="relative">
                      <input type={showConfirm ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Repeat password" className={`${inputClass("confirmPassword")} pr-12`} />
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                        {showConfirm ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Select Plan *</label>
                <select name="planId" value={formData.planId} onChange={handleChange} className={inputClass("planId")}>
                  <option value="">Choose a plan...</option>
                  {availablePlans.map((plan) => (
                    <option key={plan._id} value={plan._id}>{plan.planName}</option>
                  ))}
                </select>
                {errors.planId && <p className="text-red-500 text-xs mt-1">{errors.planId}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className={inputClass("status")}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
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
              <FaSchool />
              {submitting ? "Saving..." : isEdit ? "Update School" : "Create School"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddSchool;
