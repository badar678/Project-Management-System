import { useEffect, useState } from "react";
import api from "../../src/Services/api";
import "../../src/Styles/EmployeeDashboard.css"; // Reuse PM/Employee dark styling

const AssignProjects = () => {
  const [approvedProjects, setApprovedProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState({});

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

  const handleAssign = async (projectId) => {
    const employeeId = selectedEmployee[projectId];
    if (!employeeId) return alert("Please select an employee");
    try {
      await api.put(`/api/projects/assign/${projectId}`, { employeeId }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
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

  const assigned = approvedProjects.filter((p) => p.assignedTo).length;
  const unassigned = approvedProjects.length - assigned;

  return (
    <div className="employee-dashboard">
      <div className="main-header">
        <h2>🎯 Assign Projects</h2>
      </div>

      <ul className="project-list">
        {approvedProjects.map((p) => (
          <li key={p._id} className="project-card">
            <h3>{p.title}</h3>
            <p><strong>Budget:</strong> ${p.budget}</p>
            <p><strong>Timeline:</strong> {p.timeline}</p>
            <p><strong>Assigned To:</strong> {p.assignedTo?.name || "Not Assigned"}</p>

            <select
              value={selectedEmployee[p._id] || ""}
              onChange={(e) =>
                setSelectedEmployee({ ...selectedEmployee, [p._id]: e.target.value })
              }
            >
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.name} ({emp.email})
                </option>
              ))}
            </select>
            <button className="assign-btn" onClick={() => handleAssign(p._id)}>Assign</button>
          </li>
        ))}
      </ul>

      <div className="summary-cards">
        <div className="summary-card total">Total Approved: {approvedProjects.length}</div>
        <div className="summary-card in-progress">Assigned: {assigned}</div>
        <div className="summary-card not-started">Not Assigned: {unassigned}</div>
      </div>
    </div>
  );
};

export default AssignProjects;
