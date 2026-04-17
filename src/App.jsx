import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./Login";
import MainDashBord from "./Dashbord.jsx/MainDashBord";
import SuperAdminDashboard from "./Dashbord.jsx/SuperAdminDashboard";
import CollegeManagement from "./Dashbord.jsx/CollegeManagement";
import Plans from "./Dashbord.jsx/Plans";
import Reports from "./Dashbord.jsx/Reports";
import ChangePasswordModal from "./Dashbord.jsx/ChangePassword";
import SchoolDetail from "./Dashbord.jsx/SchoolDetail";
import PlanDetail from "./Dashbord.jsx/PlanDetail";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  if (!token || user.role !== "superAdmin") return <Navigate to="/" replace />;
  return children;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/dashbord"
        element={
          <ProtectedRoute>
            <MainDashBord />
          </ProtectedRoute>
        }
      >
        <Route index element={<SuperAdminDashboard />} />
        <Route path="college-management" element={<CollegeManagement />} />
        <Route path="college-management/:clientId" element={<SchoolDetail />} />
        <Route path="plans" element={<Plans />} />
        <Route path="plans/:planId" element={<PlanDetail />} />
        <Route path="reports" element={<Reports />} />
        <Route path="change-password" element={<ChangePasswordModal />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
