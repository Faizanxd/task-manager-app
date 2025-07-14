import KanbanBoard from "../components/KanbanBoard";
import TaskForm from "../components/TaskForm";
import UserTaskCounts from "../components/UserTaskCounts";
import "./Dashboard.css";

function Dashboard() {
  return (
    <div className="dashboard-page">
      <h2 className="dashboard-heading">Dashboard</h2>

      <div className="dashboard-section">
        <TaskForm />
      </div>

      <div className="dashboard-section">
        <KanbanBoard />
      </div>

      <div className="dashboard-section">
        <UserTaskCounts />
      </div>
    </div>
  );
}

export default Dashboard;
