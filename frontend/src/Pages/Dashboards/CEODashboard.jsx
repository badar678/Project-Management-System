import { useEffect, useState } from "react";
import api from "../../Services/api";
import {
  BsClipboard2CheckFill,
  BsHourglassSplit,
  BsCheckCircleFill,
  BsPeopleFill
} from "react-icons/bs";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from "recharts";
import "../../Styles/CEODashboard.css";

const CEODashboard = () => {
  const [approvedProjects, setApprovedProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState({});
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    assigned: 0,
  });

  const fetchApprovedProjects = async () => {
    try {
      const res = await api.get("/api/projects/all", {
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
      });
      const approved = res.data.filter((p) => p.status === "approved");
      setApprovedProjects(approved);
      const assigned = approved.filter((p) => p.assignedTo).length;
      const pending = res.data.filter((p) => p.status === "pending").length;
      setStats({
        total: res.data.length,
        approved: approved.length,
        assigned,
        pending,
      });
    } catch (err) {
      alert("❌ " + (err.response?.data?.error || err.message));
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await api.get("/api/projects/users/employees", {
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
      });
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAssign = async (projectId) => {
    const employeeId = selectedEmployee[projectId];
    if (!employeeId) return alert("Please select an employee");
    try {
      await api.put(`/api/projects/assign/${projectId}`, { employeeId }, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
      });
      alert("✅ Project assigned!");
      fetchApprovedProjects();
    } catch (err) {
      alert("❌ " + (err.response?.data?.error || err.message));
    }
  };

  useEffect(() => {
    fetchApprovedProjects();
    fetchEmployees();
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    window.location.href = "/";
  };

  const chartData = [
    { name: "Total", value: stats.total },
    { name: "Pending", value: stats.pending },
    { name: "Approved", value: stats.approved },
    { name: "Assigned", value: stats.assigned },
  ];

  return (
    <main className="main-container">
      <div className="main-header">
        <h3>CEO DASHBOARD</h3>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      <div className="main-cards">
        <div className="card">
          <div className="card-inner">
            <h3>TOTAL PROJECTS</h3>
            <BsClipboard2CheckFill className="card_icon" />
          </div>
          <h1>{stats.total}</h1>
        </div>
        <div className="card">
          <div className="card-inner">
            <h3>PENDING</h3>
            <BsHourglassSplit className="card_icon" />
          </div>
          <h1>{stats.pending}</h1>
        </div>
        <div className="card">
          <div className="card-inner">
            <h3>APPROVED</h3>
            <BsCheckCircleFill className="card_icon" />
          </div>
          <h1>{stats.approved}</h1>
        </div>
        <div className="card">
          <div className="card-inner">
            <h3>ASSIGNED</h3>
            <BsPeopleFill className="card_icon" />
          </div>
          <h1>{stats.assigned}</h1>
        </div>
      </div>

      <div className="charts">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#7551ff" />
          </BarChart>
        </ResponsiveContainer>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </main>
  );
};

export default CEODashboard;
