import React, { useState } from "react";
import Plans from "./Plans";
import SchoolManagement from "./CollegeManagement";

const Dashboard = () => {
  const [currentView, setCurrentView] = useState("plans");
  const [availablePlans, setAvailablePlans] = useState(() => {
    // Load plans from localStorage on initialization
    const savedPlans = localStorage.getItem('availablePlans');
    return savedPlans ? JSON.parse(savedPlans) : [];
  });

  const handlePlansUpdate = (updatedPlans) => {
    setAvailablePlans(updatedPlans);
    // Save plans to localStorage
    localStorage.setItem('availablePlans', JSON.stringify(updatedPlans));
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case "plans":
        return <Plans onPlansUpdate={handlePlansUpdate} />;
      case "schools":
        return <SchoolManagement availablePlans={availablePlans} />;
      default:
        return <Plans onPlansUpdate={handlePlansUpdate} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex space-x-8">
              <button
                onClick={() => setCurrentView("plans")}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  currentView === "plans"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Plans Management
              </button>
              <button
                onClick={() => setCurrentView("schools")}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  currentView === "schools"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                School Management
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {renderCurrentView()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;