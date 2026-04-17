import React, { useState } from "react";
import Swal from "sweetalert2";
import api from "../api";

export default function ChangePassword() {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.oldPassword) errs.oldPassword = "Current password is required";
    if (!formData.newPassword) errs.newPassword = "New password is required";
    else if (formData.newPassword.length < 8) errs.newPassword = "Min 8 characters";
    if (formData.newPassword !== formData.confirmPassword)
      errs.confirmPassword = "Passwords do not match";
    return errs;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const submit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);

    setLoading(true);
    try {
      await api.put("/api/admin/update-password", {
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      });
      Swal.fire({ icon: "success", title: "Password Updated", timer: 1500, showConfirmButton: false });
      setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Update failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full border px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition ${errors[field] ? "border-red-400 bg-red-50" : "border-gray-300"}`;

  return (
    <div className="h-full flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Change Password</h2>

        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Current Password</label>
            <input type="password" name="oldPassword" value={formData.oldPassword} onChange={handleChange} placeholder="Enter current password" className={inputClass("oldPassword")} />
            {errors.oldPassword && <p className="text-red-500 text-xs mt-1">{errors.oldPassword}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">New Password</label>
            <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} placeholder="Min 8 characters" className={inputClass("newPassword")} />
            {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Confirm New Password</label>
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Repeat new password" className={inputClass("confirmPassword")} />
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-semibold transition disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
