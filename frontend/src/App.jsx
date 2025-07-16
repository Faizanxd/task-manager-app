import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import useAuth from "./context/useAuth";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import SidebarLayout from "./components/SidebarLayout";
import Logs from "./components/Logs";
import TaskListPage from "./pages/TaskListPage";
import NotFound from "./pages/NotFound";
import LoadingSpinner from "./components/LoadingSpinner";
import axios from "./api/axios";

function App() {
  const { user, loading } = useAuth();
  const [wakingUp, setWakingUp] = useState(true);

  useEffect(() => {
    const pingBackend = async () => {
      try {
        await axios.get("/api/auth/ping");
      } catch (err) {
        console.warn("Waiting for server to wake...");
      } finally {
        setTimeout(() => setWakingUp(false), 2000);
      }
    };

    pingBackend();
  }, []);

  if (wakingUp || loading) return <LoadingSpinner text="Waking up server..." />;

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard"
        element={
          user ? (
            <SidebarLayout>
              <Dashboard />
            </SidebarLayout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/logs"
        element={
          user ? (
            <SidebarLayout>
              <Logs />
            </SidebarLayout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/tasks"
        element={
          user ? (
            <SidebarLayout>
              <TaskListPage />
            </SidebarLayout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
