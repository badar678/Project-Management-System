import React, { useEffect, useState } from "react";
import api from "../../src/Services/api";
import "../../src/Styles/CEOReports.css";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = ["#00C49F", "#FF8042", "#8884d8", "#FFBB28"];

const CEOReports = () => {
  const [statusStats, setStatusStats] = useState({ approved: 0, rejected: 0, pending: 0 });
  const [approvedProjects, setApprovedProjects] = useState([]);
  const [assignedData, setAssignedData] = useState([]);
  const [assignStats, setAssignStats] = useState({ assigned: 0, unassigned: 0 });

  useEffect(() => {
    fetchStatusStats();
    fetchApprovedProjects();
  }, []);

  const fetchStatusStats = async () => {
    try {
      const res = await api.get("/api/projects/stats", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setStatusStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchApprovedProjects = async () => {
    try {
      const res = await api.get("/api/projects/all", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const approved = res.data.filter((p) => p.status === "approved");
      setApprovedProjects(approved);

      const assigned = approved.filter((p) => p.assignedTo).length;
      const unassigned = approved.length - assigned;
      setAssignStats({ assigned, unassigned });

      const grouped = {};
      approved.forEach((p) => {
        const key = p.assignedTo?.name || "Unassigned";
        grouped[key] = (grouped[key] || 0) + 1;
      });
      const formatted = Object.entries(grouped).map(([name, count]) => ({
        name,
        count,
      }));
      setAssignedData(formatted);
    } catch (err) {
      console.error(err);
    }
  };

  const statusData = [
    { name: "Approved", value: statusStats.approved },
    { name: "Rejected", value: statusStats.rejected },
    { name: "Pending", value: statusStats.pending },
  ];

  const assignData = [
    { name: "Assigned", value: assignStats.assigned },
    { name: "Not Assigned", value: assignStats.unassigned },
  ];

  return (
    <div className="ceo-reports-container">
      <h2 className="dashboard-title">📈 CEO Reports</h2>

      <div className="charts-grid">
        {/* 1. Project Status Pie Chart */}
        <div className="chart-box">
          <h4>Project Status Distribution</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {statusData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 2. Status Overview Bar Chart */}
        <div className="chart-box">
          <h4>Project Status Overview</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={statusData}>
              <XAxis dataKey="name" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#00C49F" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 3. Assignment Distribution Pie Chart */}
        <div className="chart-box">
          <h4>Project Assignment Status</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={assignData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {assignData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[(index + 2) % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 4. Assigned Projects by Employee */}
        <div className="chart-box">
          <h4>Projects Assigned to Employees</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={assignedData}>
              <XAxis dataKey="name" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#FFBB28" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default CEOReports;
