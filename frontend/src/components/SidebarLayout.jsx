import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../context/useAuth";
import "./SidebarLayout.css";

function SidebarLayout({ children }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [collapsed, setCollapsed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // for mobile only

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setCollapsed(false); // reset desktop collapse
      }
      setMenuOpen(false); // always close mobile menu on resize
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className={`layout ${collapsed ? "collapsed" : ""}`}>
      {/* Mobile Header */}
      {isMobile && (
        <header className="mobile-header">
          <div className="logo">📦 TaskPro</div>
          <button
            className="menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </header>
      )}

      {/* Mobile Dropdown */}
      {isMobile && menuOpen && (
        <nav className="mobile-menu">
          <Link to="/dashboard" onClick={() => setMenuOpen(false)}>
            📝 Tasks
          </Link>
          <Link to="/logs" onClick={() => setMenuOpen(false)}>
            📜 Logs
          </Link>
          <Link to="/placeholder" onClick={() => setMenuOpen(false)}>
            🔧 Placeholder
          </Link>
          <button onClick={handleLogout}>🔓 Logout</button>
        </nav>
      )}

      {/* Desktop Sidebar */}
      {!isMobile && (
        <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
          <div className="sidebar-header">
            <div className="logo">{collapsed ? "📦" : "📦 TaskPro"}</div>
            <button
              className="menu-toggle"
              onClick={() => setCollapsed(!collapsed)}
            >
              ☰
            </button>
          </div>

          <nav className="sidebar-nav">
            <Link to="/dashboard">{collapsed ? "📝" : "📝 Tasks"}</Link>
            <Link to="/logs">{collapsed ? "📜" : "📜 Logs"}</Link>
            <Link to="/placeholder">{collapsed ? "🔧" : "🔧 Placeholder"}</Link>
            <button className="nav-btn" onClick={handleLogout}>
              {collapsed ? "🔓" : "🔓 Logout"}
            </button>
          </nav>
        </aside>
      )}

      <main className="content">{children}</main>
    </div>
  );
}

export default SidebarLayout;
