import { useEffect, useState } from "react";
import api from "../../src/Services/api";
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";
import "../../src/Styles/EmployeeReports.css";

const COLORS = ["#ff6d00", "#ffca28", "#2e7d32"];

const EmployeeReports = () => {
  const [projects, setProjects] = useState([]);

  const fetchProjects = async () => {
    try {
      const res = await api.get("/api/projects/assigned", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setProjects(res.data);
    } catch (err) {
      alert("❌ " + (err.response?.data?.error || err.message));
    }
  };

  useEffect(() => {
    fetchProjects();
    const interval = setInterval(fetchProjects, 5000);
    return () => clearInterval(interval);
  }, []);

  const total = projects.length;
  const notStarted = projects.filter(p => p.progress === "not started").length;
  const inProgress = projects.filter(p => p.progress === "in progress").length;
  const completed = projects.filter(p => p.progress === "completed").length;

  const pieData = [
    { name: "Not Started", value: notStarted },
    { name: "In Progress", value: inProgress },
    { name: "Completed", value: completed },
  ];

  const barData = [
    { name: "Total", value: total },
    { name: "Not Started", value: notStarted },
    { name: "In Progress", value: inProgress },
    { name: "Completed", value: completed },
  ];

  return (
    <div className="employee-reports">
      <h2>📊 Employee Project Reports</h2>

      <div className="report-cards">
        <div className="report-card blue">Total Projects: {total}</div>
        <div className="report-card orange">Not Started: {notStarted}</div>
        <div className="report-card yellow">In Progress: {inProgress}</div>
        <div className="report-card green">Completed: {completed}</div>
      </div>

      <div className="charts-container">
        <div className="chart-card">
          <h4>Progress Distribution (Pie)</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {pieData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h4>Project Status (Bar)</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <XAxis dataKey="name" stroke="#ffffff" angle={-15} />
              <YAxis stroke="#ffffff" />
              <Tooltip />
              <Bar dataKey="value" fill="#4caf50" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default EmployeeReports;
