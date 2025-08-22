import { useState, useEffect } from "react";
import api from "../Services/api";
import "../../src/Styles/ClientDashboard.css";

const ClientDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    timeline: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/projects/request", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      alert("✅ Project request submitted!");
      setFormData({ title: "", description: "", budget: "", timeline: "" });
      fetchProjects();
    } catch (err) {
      alert("❌ " + (err.response?.data?.error || err.message));
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await api.get("/api/projects/my-requests", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      setProjects(res.data);
    } catch (err) {
      alert("❌ Failed to fetch projects");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="client-dashboard">


      <div className="project-list">
        <h3>Your Submitted Projects:</h3>
        {projects.length === 0 ? (
          <p>No projects submitted yet.</p>
        ) : (
          <ul>
            {projects.map((p) => (
              <li key={p._id} className="project-card">
                <h4>{p.title}</h4>
                <p><strong>Status:</strong> <span className={`status ${p.status}`}>{p.status}</span></p>
                <p><strong>Budget:</strong> ${p.budget}</p>
                <p><strong>Timeline:</strong> {p.timeline}</p>
                {p.assignedTo ? (
                  <>
                    <p><strong>Assigned To:</strong> {p.assignedTo.name}</p>
                    <p><strong>Progress:</strong> {p.progress || "Not started"}</p>
                  </>
                ) : (
                  <p><em>Not assigned yet</em></p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ClientDashboard;
