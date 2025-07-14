// src/pages/Logs.jsx
import { useEffect, useState } from "react";
import axios from "../api/axios";
import socket from "../socket";
import "./Logs.css";

function Logs({ taskId }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadLogs = async () => {
    try {
      const endpoint = taskId
        ? `/api/tasks/${taskId}/logs`
        : `/api/tasks/logs/recent`;
      const res = await axios.get(endpoint);
      if (Array.isArray(res.data)) {
        setLogs(res.data);
      } else {
        console.warn("Unexpected logs format:", res.data);
        setLogs([]);
      }
    } catch (err) {
      console.error("Error loading logs:", err);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
    const handleUpdate = (data) => {
      if (!taskId || data.task?._id === taskId) {
        loadLogs();
      }
    };
    socket.on("taskUpdate", handleUpdate);
    return () => socket.off("taskUpdate", handleUpdate);
  }, [taskId]);

  if (loading) return <p className="logs-loading">Loading logs...</p>;
  if (!logs.length) return <p className="logs-empty">No logs yet.</p>;

  return (
    <div className="logs-container">
      <h3 className="logs-heading">
        {taskId ? "Task Activity Timeline" : "Recent Activity Logs"}
      </h3>
      <div className="timeline">
        {logs.map((log) => {
          const actionIcon =
            {
              created: "➕",
              updated: "✏️",
              deleted: "🗑️",
            }[log.action?.toLowerCase()] || "📝";

          const initials = log.user
            .split(" ")
            .map((n) => n[0]?.toUpperCase())
            .join("")
            .slice(0, 2); // max 2 letters

          return (
            <div className="timeline-item" key={log._id}>
              <div className="timeline-dot">
                <span className="dot-icon">{actionIcon}</span>
                <span className="dot-initials">{initials}</span>
              </div>

              <div className="log-user-action">
                {log.user} — {log.action}
              </div>
              <div className="log-timestamp">
                {new Date(log.timestamp).toLocaleString()}
              </div>
              {log.field && (
                <div className="log-change-details">
                  <strong>{log.field}</strong>: "{log.oldValue}" → "
                  {log.newValue}"
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Logs;
