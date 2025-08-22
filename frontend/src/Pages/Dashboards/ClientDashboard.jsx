import { useState, useEffect } from "react";
import api from "../../Services/api";
import "../../Styles/ClientDashboard.css";

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
          Authorization: `Bearer ${sessionStorage.getItem("token")}`
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
          Authorization: `Bearer ${sessionStorage.getItem("token")}`
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
    sessionStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="client-dashboard">
       <div className="main-header">
        <h3>Client Dashboard</h3>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
      <h2>Submit a Project Request:</h2>

      <form onSubmit={handleSubmit} className="project-form">
        <input
          name="title"
          placeholder="Project Title"
          onChange={handleChange}
          value={formData.title}
          required
        />
        <textarea
          name="description"
          placeholder="Project Description"
          onChange={handleChange}
          value={formData.description}
          rows="4"
          required
        ></textarea>
        <input
          name="budget"
          type="number"
          placeholder="Estimated Budget"
          onChange={handleChange}
          value={formData.budget}
          required
        />
        <input
          name="timeline"
          placeholder="Timeline (e.g. 2 weeks)"
          onChange={handleChange}
          value={formData.timeline}
          required
        />
        <button type="submit">Submit Request</button>
      </form>
    </div>
  );
};

export default ClientDashboard;
