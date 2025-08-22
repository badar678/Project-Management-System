import { useEffect, useState } from "react";
import api from "../../Services/api";
import "../../Styles/ViewTasks.css"; // Reusing shared styles

const EmployeeDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get("/api/projects/assigned", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setTasks(res.data);
        setError("");
      } catch (err) {
        console.error("Error fetching employee tasks:", err);
        setError(err.response?.data?.error || "Failed to load your tasks.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const updateProgress = async (projectId, progress) => {
    try {
      await api.put(
        `/api/projects/update-progress/${projectId}`,
        { progress },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      // Refresh task list
      const res = await api.get("/api/projects/assigned", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setTasks(res.data);
    } catch (err) {
      console.error("Error updating progress:", err);
      setError(err.response?.data?.error || "Failed to update progress.");
    }
  };

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.progress === "completed").length;
    const inProgress = tasks.filter(t => t.progress === "in progress").length;
    const notStarted = tasks.filter(t => t.progress === "not started" || !t.progress).length;

    return { total, completed, inProgress, notStarted };
  };

  const stats = getTaskStats();

  return (
    <div className="main-container">
    <div className="view-tasks-container">
      <h1>👨‍💼 Employee Dashboard</h1>

  

      <h2>📋 My Assigned Tasks</h2>

      {loading ? (
        <p>Loading your tasks...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : tasks.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <p>🎯 No tasks assigned to you yet.</p>
          <p style={{ color: "#666", fontSize: "0.9em" }}>
            Tasks assigned by your PM will appear here.
          </p>
        </div>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task._id} className="task-item">
              <div className="task-header">
                <strong>{task.title}</strong>
                <span className={`task-status ${task.status}`}>{task.status}</span>
              </div>
              <p className="task-description">{task.description}</p>
              <div className="task-details">
                <p><strong>Budget:</strong> ${task.budget}</p>
                <p><strong>Timeline:</strong> {task.timeline}</p>
                <p><strong>Current Progress:</strong> {task.progress || "not started"}</p>
                <p><strong>Project Status:</strong> {task.status}</p>
              </div>
              <div className="progress-update">
                <label htmlFor={`progress-${task._id}`}>Update Progress:</label>
                <select
                  id={`progress-${task._id}`}
                  value={task.progress || "not started"}
                  onChange={(e) => updateProgress(task._id, e.target.value)}
                  disabled={task.status !== "approved"}
                  title={task.status !== "approved" ? "Can only update progress on approved projects" : ""}
                >
                  <option value="not started">Not Started</option>
                  <option value="in progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
                {task.status !== "approved" && (
                  <small style={{ color: "#e74c3c", marginLeft: "10px" }}>
                    Progress updates available only for approved projects
                  </small>
                )}
              </div>
            </li>
            
          ))}
        </ul>
      )}
    </div>
  {/*   <div className="task-summary">
        <p><strong>Total Tasks:</strong> {stats.total}</p>
        <p><strong>Completed:</strong> {stats.completed}</p>
        <p><strong>In Progress:</strong> {stats.inProgress}</p>
        <p><strong>Not Started:</strong> {stats.notStarted}</p>
      </div> */}
    </div>
  );
};

export default EmployeeDashboard;
