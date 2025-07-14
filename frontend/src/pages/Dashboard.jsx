import KanbanBoard from "../components/KanbanBoard";
import TaskForm from "../components/TaskForm";
import UserTaskCounts from "../components/UserTaskCounts";

function Dashboard() {
  return (
    <div>
      <h2 style={{ marginBottom: "1rem" }}>Dashboard</h2>
      <TaskForm />
      <div style={{ marginTop: "2rem" }}>
        <KanbanBoard />
      </div>
      <div style={{ marginTop: "2rem" }}>
        <UserTaskCounts />
      </div>
    </div>
  );
}

export default Dashboard;
