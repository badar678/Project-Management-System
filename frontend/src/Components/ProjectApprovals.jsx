// src/Components/CEO/ProjectApprovals.jsx
import { useEffect, useState } from "react";
import api from "../../src/Services/api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import "../../src/Styles/ProjectApprovals.css";

const ProjectApprovals = () => {
  const [pendingProjects, setPendingProjects] = useState([]);
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0 });

  const fetchPendingProjects = async () => {
    try {
      const res = await api.get("/api/projects/pending", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setPendingProjects(res.data);
      setStats((prev) => ({ ...prev, pending: res.data.length }));
    } catch (err) {
      alert("❌ " + (err.response?.data?.error || err.message));
    }
  };

  const fetchProjectStats = async () => {
    try {
      const res = await api.get("/api/projects/stats", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setStats(res.data); // should return { pending, approved, rejected }
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleAction = async (id, action) => {
    try {
      await api.put(`/api/projects/${action}/${id}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert(`✅ Project ${action === "approve" ? "approved" : "rejected"}!`);
      fetchPendingProjects();
      fetchProjectStats();
    } catch (err) {
      alert("❌ " + (err.response?.data?.error || err.message));
    }
  };

  useEffect(() => {
    fetchPendingProjects();
    fetchProjectStats();
  }, []);

  const chartData = [
    { name: "Approved", count: stats.approved },
    { name: "Rejected", count: stats.rejected },
    { name: "Pending", count: stats.pending },
  ];

  return (
    <div className="project-approvals-container">
      <div className="main-content">
        <h2 className="dashboard-title">📊 CEO Project Approval Dashboard</h2>

        <h3 className="section-title">📝 Pending Approvals</h3>
        <ul className="project-list">
          {pendingProjects.map((p) => (
             <li key={p._id} className="project-item">
              <strong>{p.title}</strong> <span className="by-client">by</span> <span className="client-name">{p.client?.name}</span> <br /><br />
              📝Description: <em>{p.description}</em> <br />
              💰 Budget: ${p.budget} <br />
              🗓️ Timeline: {p.timeline}
              <div className="action-buttons">
                <button className="btn-approve" onClick={() => handleAction(p._id, "approve")}>Approve</button>
                <button className="btn-reject" onClick={() => handleAction(p._id, "reject")}>Reject</button>
              </div>
            </li>
          ))}
        </ul>

         <div className="stats-cards">
          <div className="card pending">Pending: {stats.pending}</div>
          <div className="card approved">Approved: {stats.approved}</div>
          <div className="card rejected">Rejected: {stats.rejected}</div>
        </div>

      
      </div>
    </div>
  );
};

export default ProjectApprovals;
