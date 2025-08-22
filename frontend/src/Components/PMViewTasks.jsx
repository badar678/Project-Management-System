import { useEffect, useState } from "react";
import api from "../Services/api";
import "../Styles/ViewTasks.css";

const ViewTasksPM = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [employeeError, setEmployeeError] = useState("");
  const [taskError, setTaskError] = useState("");

  // Load employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await api.get("/api/projects/users/employees");
        setEmployees(res.data);
        setEmployeeError("");
      } catch (error) {
        console.error("❌ Failed to load employees:", error);
        setEmployeeError(error.response?.data?.error || "Failed to load employees");
      } finally {
        setLoadingEmployees(false);
      }
    };

    fetchEmployees();
  }, []);

  // Load tasks for selected employee
  useEffect(() => {
    if (!selectedEmployee) {
      setTasks([]);
      return;
    }

    const fetchTasks = async () => {
      setLoadingTasks(true);
      setTaskError("");
      try {
        const res = await api.get(`/api/projects/employee/${selectedEmployee}`);
        setTasks(res.data);
      } catch (error) {
        console.error("❌ Failed to fetch tasks:", error);
        setTaskError(error.response?.data?.error || "Failed to fetch tasks");
        setTasks([]);
      } finally {
        setLoadingTasks(false);
      }
    };

    fetchTasks();
  }, [selectedEmployee]);

  const getSelectedEmployeeName = () => {
    const employee = employees.find(emp => emp._id === selectedEmployee);
    return employee ? employee.name : "Unknown Employee";
  };

  return (
    <div className="main-container">
    <div className="view-tasks-container">
      <h1>📊 View Employee Tasks (PM)</h1>

      {loadingEmployees ? (
        <p>Loading employees...</p>
      ) : employeeError ? (
        <p className="error">{employeeError}</p>
      ) : (
        <div className="employee-selector">
          <label htmlFor="employee-select">Select an employee to view their tasks:</label>
          <select
            id="employee-select"
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
          >
            <option value="">-- Choose an employee --</option>
            {employees.map((emp) => (
              <option key={emp._id} value={emp._id}>
                {emp.name} ({emp.email})
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedEmployee && (
        <>
          <h2>📋 Tasks for {getSelectedEmployeeName()}</h2>

          {loadingTasks ? (
            <p>Loading tasks...</p>
          ) : taskError ? (
            <p className="error">{taskError}</p>
          ) : tasks.length === 0 ? (
            <p>No tasks assigned to this employee yet.</p>
          ) : (
            <ul className="task-list">
              {tasks.map((task) => (
                <li key={task._id} className="task-item">
                  <div className="task-header">
                    <strong>{task.title}</strong>
                    <span className={`task-status ${task.status.toLowerCase().replace(" ", "-")}`}>
                      {task.status}
                    </span>
                  </div>
                  <p className="task-description">{task.description}</p>
                  <div className="task-details">
                    <p><strong>Due Date:</strong> {new Date(task.dueDate).toLocaleDateString()}</p>
                    <p><strong>Estimate:</strong> {task.timeEstimateHours}h</p>
                    <p><strong>Hours Logged:</strong> {task.hoursLogged}</p>
                    <p><strong>Status:</strong> {task.status}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="task-summary">
            <p><strong>Total Tasks:</strong> {tasks.length}</p>
            <p><strong>Completed:</strong> {tasks.filter(t => t.status === "Completed").length}</p>
            <p><strong>In Progress:</strong> {tasks.filter(t => t.status === "In Progress").length}</p>
            <p><strong>Not Started:</strong> {tasks.filter(t => t.status === "Not Started").length}</p>
          </div>
        </>
      )}
    </div>
    </div>
  );
};

export default ViewTasksPM;
