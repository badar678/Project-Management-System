import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell,
} from "recharts";
import api from "../../src/Services/api";
import "../../src/Styles/PMReports.css"; // Same background & layout

const COLORS = ["#4caf50", "#ff9800", "#f44336", "#2196f3", "#9c27b0"];

const PMReports = () => {
  const [approvedProjects, setApprovedProjects] = useState([]);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchApprovedProjects();
    fetchEmployees();
  }, []);

  const fetchApprovedProjects = async () => {
    try {
      const res = await api.get("/api/projects/all", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const approved = res.data.filter((p) => p.status === "approved");
      setApprovedProjects(approved);
    } catch (err) {
      alert("❌ " + (err.response?.data?.error || err.message));
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await api.get("/api/projects/users/employees", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const assigned = approvedProjects.filter((p) => p.assignedTo).length;
  const unassigned = approvedProjects.length - assigned;

  const pieData = [
    { name: "Assigned", value: assigned },
    { name: "Not Assigned", value: unassigned },
  ];

  const barData = employees.map((emp) => {
    const count = approvedProjects.filter((p) => p.assignedTo?._id === emp._id).length;
    return { name: emp.name, Projects: count };
  });

  return (
    <div className="employee-dashboard">
      <div className="main-header">
        <h2>📊 PM Reports</h2>
        
      </div>

      <div className="charts-section">
        <div className="chart-card">
          <h3>Assigned vs Not Assigned</h3>
          <PieChart width={300} height={250}>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        <div className="chart-card">
          <h3>Projects per Employee</h3>
          <BarChart width={400} height={250} data={barData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Projects" fill="#2196f3" />
          </BarChart>
        </div>
      </div>
    </div>
  );
};

export default PMReports;
