import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginSignup from "./Pages/loginSignup";
import CEODashboard from "./Pages/Dashboards/CEODashboard";
import PMDashboard from "./Pages/Dashboards/PMDashboard";
import EmployeeDashboard from "./Pages/Dashboards/EmployeeDashboard";
import ClientDashboard from "./Pages/Dashboards/ClientDashboard";
import ClientReports from "./Components/ClientReports";
import EmployeeReports from "./Components/EmployeeReports";
import PMReports from "./Components/PMReports";
import ProtectedRoute from "./Components/ProtectedRoute";
import ResetPassword from "./Pages/resetPassword";
import DashboardLayout from "./Components/DashboardLayout";
import ProjectApprovals from "./Components/ProjectApprovals";
import AssignProjects from "./Components/AssignProjects";
import CEOReports from "./Components/CEOReports";
import SubmittedProjects from "./Components/SubmittedProjects";
import CreateTask from "./Components/CreateTask";
import PMViewTasks from "./Components/PMViewTasks";
import EmployeeViewTasks from "./Components/EmployeeViewTasks";


function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LoginSignup />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Dashboard Layout with Nested Protected Routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route
            path="ceo"
            element={
              <ProtectedRoute allowedRole="ceo">
                <CEODashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="project-approvals"
            element={
              <ProtectedRoute allowedRole="ceo">
                <ProjectApprovals />
              </ProtectedRoute>
            }
          />
          <Route
            path="pm"
            element={
              <ProtectedRoute allowedRole="pm">
                <PMDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="pm/reports"
            element={
              <ProtectedRoute allowedRole="pm">
                <PMReports />
              </ProtectedRoute>
            }
          />
          <Route
            path="pm/create-task"
            element={
              <ProtectedRoute allowedRole="pm">
                <CreateTask />
              </ProtectedRoute>
            }
          />
          <Route
            path="pm/view-tasks"
            element={
              <ProtectedRoute allowedRole="pm">
                <PMViewTasks />
              </ProtectedRoute>
            }
          />
          <Route
            path="employee/view-tasks"
            element={
              <ProtectedRoute allowedRole="employee">
                <EmployeeViewTasks />
              </ProtectedRoute>
            }
          />
          <Route
            path="employee"
            element={
              <ProtectedRoute allowedRole="employee">
                <EmployeeDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="employee/reports"
            element={
              <ProtectedRoute allowedRole="employee">
                <EmployeeReports />
              </ProtectedRoute>
            }
          />
          <Route
            path="client"
            element={
              <ProtectedRoute allowedRole="client">
                <ClientDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="client/reports"
            element={
              <ProtectedRoute allowedRole="client">
                <ClientReports />
              </ProtectedRoute>
            }
          />
          <Route
            path="assign-projects"
            element={
              <ProtectedRoute allowedRole="ceo|pm">
                <AssignProjects />
              </ProtectedRoute>
            }
          />
          <Route
             path="ceo/reports"
             element={
                <ProtectedRoute allowedRole="ceo">
                 <CEOReports />
              </ProtectedRoute>
                 }
             />
             <Route
             path="client/submitted-projects"
             element={
                <ProtectedRoute allowedRole="client">
                 <SubmittedProjects />
              </ProtectedRoute>
               }
               />

        </Route>

      </Routes>
    </Router>
  );
}

export default App;
