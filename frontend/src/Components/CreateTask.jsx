import { useState, useEffect } from "react";
import api from "../Services/api";
import "../Styles/CreateTask.css";

const CreateTask = ({ projectId }) => {
  const [task, setTask] = useState({
    title: "",
    description: "",
    assignedTo: "",
    dueDate: "",
    timeEstimateHours: 1,
    projectId,
  });
  const [employees, setEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [employeeError, setEmployeeError] = useState("");

  useEffect(() => {
    // Fetch employees for dropdown
    api.get("/api/projects/users/employees")
      .then(res => {
        setEmployees(res.data);
        setLoadingEmployees(false);
      })
      .catch(err => {
        setEmployeeError("Failed to load employees");
        setLoadingEmployees(false);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Convert types for backend compatibility
    const payload = {
      ...task,
      timeEstimateHours: Number(task.timeEstimateHours),
      dueDate: new Date(task.dueDate),
    };
    console.log("Submitting task:", payload);
    try {
      await api.post("/api/projects/create", payload);
      alert("Task created!");
    } catch (err) {
      alert("Error: " + (err.response?.data?.error || err.message));
      console.error(err);
    }
    console.log("Submitting task:", payload);
  };

  return (
    <div className="background">
    <div className="create-task-container">
      <h2>Create New Task</h2>
      <form className="create-task-form" onSubmit={handleSubmit}>
        <label>Task Title</label>
        <input
          placeholder="Enter task title"
          onChange={(e) => setTask({ ...task, title: e.target.value })}
          required
        />

        <label>Description</label>
        <textarea
          placeholder="Enter task description"
          rows={4}
          onChange={(e) => setTask({ ...task, description: e.target.value })}
          required
        />

        <label>Assign To (Employee)</label>
        {loadingEmployees ? (
          <div>Loading employees...</div>
        ) : employeeError ? (
          <div style={{ color: 'red' }}>{employeeError}</div>
        ) : (
          <select
            value={task.assignedTo}
            onChange={e => setTask({ ...task, assignedTo: e.target.value })}
            required
          >
            <option value="">Select employee</option>
            {employees.map(emp => (
              <option key={emp._id} value={emp._id}>
                {emp.name} ({emp.email})
              </option>
            ))}
          </select>
        )}

        <label>Due Date</label>
        <input
          type="date"
          onChange={(e) => setTask({ ...task, dueDate: e.target.value })}
          required
        />

        <label>Time Estimate (in hours)</label>
        <input
          type="number"
          min="1"
          onChange={(e) =>
            setTask({ ...task, timeEstimateHours: e.target.value })
          }
          required
        />

        <button type="submit">Create Task</button>
      </form>
    </div>
    </div>
  );
};

export default CreateTask;
