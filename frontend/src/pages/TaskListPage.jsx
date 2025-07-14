import { useEffect, useState } from "react";
import axios from "../api/axios";
import socket from "../socket";
import useAuth from "../context/useAuth";
import { useNavigate } from "react-router-dom";
import "./TaskListPage.css";

function TaskListPage() {
  const [tasks, setTasks] = useState([]);
  const [taskLogs, setTaskLogs] = useState({});
  const [editingTask, setEditingTask] = useState(null);
  const [conflictData, setConflictData] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  useEffect(() => {
    if (!user) return navigate("/login");
    const loadTasks = async () => {
      try {
        const res = await axios.get("/api/tasks");
        const taskData = res.data;
        setTasks(taskData);

        const logsByTask = {};
        await Promise.all(
          taskData.map(async (task) => {
            try {
              const logRes = await axios.get(`/api/tasks/${task._id}/logs`);
              logsByTask[task._id] = logRes.data;
            } catch {
              logsByTask[task._id] = [];
            }
          })
        );
        setTaskLogs(logsByTask);
      } catch (err) {
        console.error("Error loading tasks:", err);
      }
    };

    loadTasks();
    socket.on("taskUpdate", loadTasks);
    return () => socket.off("taskUpdate", loadTasks);
  }, [user, navigate]);

  const submitEdit = async () => {
    try {
      await axios.put(`/api/tasks/${editingTask._id}`, {
        changes: {
          title: editingTask.title,
          status: editingTask.status,
          priority: editingTask.priority,
        },
        version: editingTask.lastModifiedAt,
        username: user.username,
      });
      setEditingTask(null);
    } catch (err) {
      if (err.response?.status === 409) {
        setConflictData(err.response.data);
      } else {
        console.error("Edit error:", err);
        alert("Failed to update task");
      }
    }
  };

  const resolveConflict = async (useServerVersion = false) => {
    const taskToSend = useServerVersion
      ? conflictData.current
      : conflictData.yourChanges;

    try {
      await axios.put(`/api/tasks/${conflictData.current._id}`, {
        changes: taskToSend,
        username: user.username,
      });
      setConflictData(null);
      setEditingTask(null);
    } catch (err) {
      console.error("Conflict resolution failed:", err);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchSearch =
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.assignedTo?.email?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || task.status === statusFilter;
    const matchPriority =
      priorityFilter === "All" || task.priority === priorityFilter;
    return matchSearch && matchStatus && matchPriority;
  });

  return (
    <div className="all-tasks">
      <h2 className="page-title">All Tasks</h2>
      <div className="task-filters">
        <input
          type="text"
          placeholder="Search by title or assignee"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Todo">Todo</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option value="All">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      <div className="task-list">
        {filteredTasks.length === 0 ? (
          <p>No tasks match the filters.</p>
        ) : (
          filteredTasks.map((task) => {
            const logs = taskLogs[task._id] || [];
            const latest = logs[0];
            return (
              <div key={task._id} className="task-card fade-in">
                <div className="task-title">{task.title}</div>
                <div className="task-meta">
                  <span className={`badge status ${task.status.toLowerCase()}`}>
                    {task.status}
                  </span>
                  <span
                    className={`badge priority ${task.priority.toLowerCase()}`}
                  >
                    {task.priority}
                  </span>
                  <span className="assigned">
                    {task.assignedTo?.email || "Unassigned"}
                  </span>
                </div>
                {latest && (
                  <div className="log-line">
                    <em>{latest.user}</em> — {latest.action} •{" "}
                    <span title={new Date(latest.timestamp).toLocaleString()}>
                      {new Date(latest.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                )}
                <div className="task-actions">
                  <button
                    className="btn-edit"
                    onClick={() => setEditingTask(task)}
                  >
                    Edit
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 🛠 Edit Modal */}
      {editingTask && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h3>Edit Task</h3>
            <input
              type="text"
              value={editingTask.title}
              onChange={(e) =>
                setEditingTask({ ...editingTask, title: e.target.value })
              }
              placeholder="Title"
            />
            <select
              value={editingTask.status}
              onChange={(e) =>
                setEditingTask({ ...editingTask, status: e.target.value })
              }
            >
              <option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
            <select
              value={editingTask.priority}
              onChange={(e) =>
                setEditingTask({ ...editingTask, priority: e.target.value })
              }
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>

            <div className="modal-buttons">
              <button className="btn-edit" onClick={submitEdit}>
                Save
              </button>
              <button
                className="btn-cancel"
                onClick={() => setEditingTask(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ⚠️ Conflict Modal */}
      {conflictData && (
        <div className="modal-backdrop">
          <div className="modal-content conflict">
            <h3>⚠️ Conflict Detected</h3>
            <p>Another user updated this task before you.</p>

            <div className="conflict-section">
              <h4>Server Version</h4>
              <pre>{JSON.stringify(conflictData.current, null, 2)}</pre>
            </div>

            <div className="conflict-section">
              <h4>Your Changes</h4>
              <pre>{JSON.stringify(conflictData.yourChanges, null, 2)}</pre>
            </div>

            <div className="modal-buttons">
              <button
                className="btn-danger"
                onClick={() => resolveConflict(true)}
              >
                Overwrite Mine
              </button>
              <button
                className="btn-edit"
                onClick={() => resolveConflict(false)}
              >
                Keep Mine
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskListPage;
