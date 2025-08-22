import { useEffect, useState } from "react";
import api from "../Services/api";
import "../Styles/ViewTasks.css";

const EmployeeViewTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get("/api/projects/assigned");
        setTasks(res.data); // ✅ THIS WAS MISSING
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
      await api.put(`/api/projects/update-progress/${projectId}`, { progress });
      // Refresh tasks after updating progress
      const res = await api.get("/api/projects/assigned");
      setTasks(res.data);
    } catch (err) {
      console.error("Error updating progress:", err);
      setError(err.response?.data?.error || "Failed to update progress.");
    }
  };

  return (
    <div className="view-tasks-container">
      <h2>📋 My Tasks</h2>

      {loading ? (
        <p>Loading tasks...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : tasks.length === 0 ? (
        <p>No tasks assigned to you yet.</p>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task._id} className="task-item">
              <div className="task-header">
                <strong>{task.title}</strong>
                <span className="task-status">{task.status}</span>
              </div>
              <p className="task-description">{task.description}</p>
              <div className="task-details">
                <p><strong>Budget:</strong> ${task.budget}</p>
                <p><strong>Timeline:</strong> {task.timeline}</p>
                <p><strong>Progress:</strong> {task.progress || "not started"}</p>
              </div>
              <div className="progress-update">
                <label htmlFor={`progress-${task._id}`}>Update Progress:</label>
                <select
                  id={`progress-${task._id}`}
                  value={task.progress || "not started"}
                  onChange={(e) => updateProgress(task._id, e.target.value)}
                >
                  <option value="not started">Not Started</option>
                  <option value="in progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EmployeeViewTasks;
