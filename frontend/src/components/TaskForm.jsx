import { useState, useEffect } from "react";
import axios from "../api/axios";
import useAuth from "../context/useAuth";
import "./TaskForm.css";

function TaskForm({ onTaskCreated }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [users, setUsers] = useState([]);
  const [assignedTo, setAssignedTo] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  const { user } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("/api/auth/users");
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setMessage({ type: "error", text: "Failed to load users." });
      }
    };

    fetchUsers();
  }, []);

  const resetForm = () => {
    setTitle("");
    setDesc("");
    setAssignedTo("");
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 4000);
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (!assignedTo) return showMessage("error", "Please select a user");

    try {
      await axios.post("/api/tasks", {
        title,
        description: desc,
        priority,
        username: user.username,
        board: "Main",
        assignedTo,
      });

      showMessage("success", "Task created successfully");
      resetForm();
      onTaskCreated?.();
    } catch (err) {
      console.error("Manual task error:", err);
      showMessage("error", err.response?.data?.error || "Error creating task");
    }
  };

  const handleSmartAssign = async (e) => {
    e.preventDefault();

    try {
      const createRes = await axios.post("/api/tasks", {
        title,
        description: desc,
        priority,
        username: user.username,
        board: "Main",
        assignedTo: null,
      });

      const taskId = createRes.data._id;

      await axios.post("/api/tasks/smart-assign", {
        taskId,
        username: user.username,
      });

      showMessage("success", "Task smart assigned successfully");
      resetForm();
      onTaskCreated?.();
    } catch (err) {
      console.error("Smart assign error:", err);
      showMessage("error", err.response?.data?.error || "Smart assign failed");
    }
  };

  return (
    <form className="task-form fade-in" onSubmit={handleManualSubmit}>
      <h3>Create Task</h3>

      {message.text && (
        <p className={`form-message ${message.type}`}>{message.text}</p>
      )}

      <div className="form-group">
        <label>
          Title<span>*</span>
        </label>
        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Description</label>
        <input
          type="text"
          placeholder="Optional description"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Priority</label>
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      <div className="form-group">
        <label>Assign to</label>
        <select
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
        >
          <option value="">-- Select user manually --</option>
          {users.map((u) => (
            <option key={u._id} value={u.email}>
              {u.email}
            </option>
          ))}
        </select>
      </div>

      <div className="form-buttons">
        <button type="submit">Create Task</button>
        <button onClick={handleSmartAssign} type="button">
          Smart Assign
        </button>
      </div>
    </form>
  );
}

export default TaskForm;
