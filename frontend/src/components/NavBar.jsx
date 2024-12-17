/**
 * Created by Barry Chen
 * 260952566
 */
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/images/Logo.png";
import { useUser } from "../contexts/UserContext";
import { MenuOutlined, CloseOutlined } from "@ant-design/icons";

export default function NavBar() {
  const { user, dispatch, isLoggingOut } = useUser();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async (e) => {
    e.preventDefault();
    navigate("/landing");
    dispatch({ type: "auth/logout" });
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className={`nav-bar ${isMenuOpen ? "show-overlay" : ""}`}>
      <div className="nav-logo-container">
        <NavLink to="/" replace>
          <img src={logo} alt="logo" className="nav-bar-logo" />
        </NavLink>
        <h2>
          {user ? `Welcome, ${user.name} 👋` : "Login first to explore more"}
        </h2>
      </div>
      <div className="nav-menu-icon" onClick={toggleMenu}>
        <MenuOutlined />
      </div>
      <div className="nav-close-icon" onClick={toggleMenu}>
        <CloseOutlined />
      </div>

      <ul className="nav-links">
        <li>
          <NavLink to="events" onClick={toggleMenu}>
            Events
          </NavLink>
        </li>
        <li>
          <NavLink to="profile" end onClick={toggleMenu}>
            Profile
          </NavLink>
        </li>
        <li className="nav-logout">
          {user ? (
            <button
              className="btn logout-btn"
              disabled={isLoggingOut}
              onClick={(e) => {
                handleLogout(e);
                toggleMenu();
              }}
            >
              {isLoggingOut ? "Logging out..." : "Logout"}
            </button>
          ) : (
            <button
              className="btn"
              onClick={() => {
                handleLogin();
                toggleMenu();
              }}
            >
              Login
            </button>
          )}
        </li>
      </ul>
    </nav>
  );
}
