// src/Layouts/DashboardLayout.jsx
import { Outlet } from "react-router-dom";
import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import { useState } from "react";

const DashboardLayout = () => {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const OpenSidebar = () => setOpenSidebarToggle(!openSidebarToggle);

  // Get role from sessionStorage
  const role = sessionStorage.getItem("role");

  return (
    <div className="grid-container">
      <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} role={role} />
      <div className="main-content">
        <Outlet /> {/* This will render CEO, PM, Employee, or Client dashboard */}
      </div>
    </div>
  );
};

export default DashboardLayout;
