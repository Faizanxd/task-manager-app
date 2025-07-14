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
        const res = await axios.get("http://localhost:5000/api/auth/users");
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
      const res = await axios.post("http://localhost:5000/api/tasks", {
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
      console.error("Manual task error:", err.response?.data || err.message);
      showMessage("error", err.response?.data?.error || "Error creating task");
    }
  };

  const handleSmartAssign = async (e) => {
    e.preventDefault();

    try {
      const createRes = await axios.post("http://localhost:5000/api/tasks", {
        title,
        description: desc,
        priority,
        username: user.username,
        board: "Main",
        assignedTo: null,
      });

      const taskId = createRes.data._id;

      await axios.post("http://localhost:5000/api/tasks/smart-assign", {
        taskId,
        username: user.username,
      });

      showMessage("success", "Task smart assigned successfully");
      resetForm();
      onTaskCreated?.();
    } catch (err) {
      console.error("Smart assign error:", err.response?.data || err.message);
      showMessage("error", err.response?.data?.error || "Smart assign failed");
    }
  };

  return (
    <form className="task-form fade-in">
      <h3>Create Task</h3>

      {message.text && (
        <p className={`form-message ${message.type}`}>{message.text}</p>
      )}

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Description"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
      />

      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>

      <select
        value={assignedTo}
        onChange={(e) => setAssignedTo(e.target.value)}
      >
        <option value="">-- Select a user --</option>
        {users.map((u) => (
          <option key={u._id} value={u.email}>
            {u.email}
          </option>
        ))}
      </select>

      <div className="form-buttons">
        <button onClick={handleManualSubmit}>Create Task</button>
        <button onClick={handleSmartAssign}>Smart Assign</button>
      </div>
    </form>
  );
}

export default TaskForm;
