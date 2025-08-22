import { useEffect, useState } from "react";
import api from "../../src/Services/api";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";
import "../../src/Styles/ClientReports.css";

const ClientReports = () => {
  const [projects, setProjects] = useState([]);

  const fetchProjects = async () => {
    try {
      const res = await api.get("/api/projects/my-requests", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      setProjects(res.data);
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  };

  useEffect(() => {
    fetchProjects();
    const interval = setInterval(fetchProjects, 5000); // Refresh every 5s
    return () => clearInterval(interval);
  }, []);

  const statusCounts = projects.reduce((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {});

  const chartData = [
    { status: "Pending", count: statusCounts.pending || 0 },
    { status: "Approved", count: statusCounts.approved || 0 },
    { status: "Rejected", count: statusCounts.rejected || 0 },
  ];

  const pieColors = {
    pending: "#ff9800",
    approved: "#4caf50",
    rejected: "#f44336",
  };

  const totalBudget = projects.reduce((sum, p) => sum + Number(p.budget || 0), 0);
  const budgetByStatus = projects.reduce((acc, p) => {
    const status = p.status.toLowerCase();
    acc[status] = (acc[status] || 0) + Number(p.budget || 0);
    return acc;
  }, {});

  return (
    <div className="client-reports">
      <h2>📊 Client Reports</h2>

      <div className="budget-summary">
        <div className="budget-card">
          <h4>Total Budget</h4>
          <p>${totalBudget.toLocaleString()}</p>
        </div>
        <div className="budget-card pending">
          <h4>Pending Budget</h4>
          <p>${(budgetByStatus.pending || 0).toLocaleString()}</p>
        </div>
        <div className="budget-card approved">
          <h4>Approved Budget</h4>
          <p>${(budgetByStatus.approved || 0).toLocaleString()}</p>
        </div>
        <div className="budget-card rejected">
          <h4>Rejected Budget</h4>
          <p>${(budgetByStatus.rejected || 0).toLocaleString()}</p>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart-card">
          <h3>Project Status Overview</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <XAxis dataKey="status" stroke="#ccc" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Status Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={pieColors[entry.status.toLowerCase()] || "#8884d8"} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ClientReports;
