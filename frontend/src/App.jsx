import { Routes, Route, Navigate } from "react-router-dom";
import useAuth from "./context/useAuth";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import SidebarLayout from "./components/SidebarLayout";
import Logs from "./pages/Logs";
import TaskListPage from "./pages/TaskListPage";

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          user ? (
            <SidebarLayout>
              <Dashboard />{" "}
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
              <Logs />{" "}
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
              <TaskListPage />{" "}
            </SidebarLayout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
