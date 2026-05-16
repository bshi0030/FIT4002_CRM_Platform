import { useState } from "react";
import "./App.css";
import logo from "./assets/CRM_logo.png";
import Sidebar from "./components/SideBar";
import CustomerProfile from "./components/CustomerProfile";
import CustomerList from "./components/CustomerList";
import NotificationBell from './components/NotificationBell';

function App() {
  const [currentPage, setCurrentPage] = useState("home");

  return (
    <div className="app-layout">
      
      <div className="sidebar">
        {/* LOGO */}
        <div className="sidebar-top">
          <img src={logo} alt="CRM Logo" className="logo" />

          <div className="logo-text">
            <p>Next Generation CRM Platform</p>
          </div>
        </div>
        
        {/* The rest of the sidebar menu is inside Sidebar component */}
        <div className="sidebar-menu-container">
          <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
        </div>
      </div>

      <main className="main-content">
        <div className="topbar">
          <NotificationBell />
          <div className="user-icon-wrapper">
            <svg viewBox="0 0 24 24" fill="#fdf5d3" stroke="var(--text-h)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="topbar-user-icon">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <span className="logout-text">Log Out</span>
        </div>
        <div className="content-area">
          {currentPage === "home" ? (
            <div className="home-placeholder">
              <h1>Welcome to NexGen CRM</h1>
            </div>
          ) : currentPage === "customer-list" ? (
            <CustomerList setCurrentPage={setCurrentPage} />
          ) : (
            <CustomerProfile setCurrentPage={setCurrentPage} />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;