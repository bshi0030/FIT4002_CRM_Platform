import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import "./App.css";
import logo from "./assets/CRM_logo.png";
import Sidebar from "./components/Sidebar";
import Customers from "./pages/Customers";
import CustomerDetail from "./pages/CustomerDetail";

function App() {
  return (
    <Router>
      <div className="app-layout">
        {/* Placeholder for Sidebar */}
        <div className="sidebar">
          <div className="sidebar-top">
            <img src={logo} alt="CRM Logo" className="logo" />
            <div className="logo-text">
              <p>Next Generation CRM Platform</p>
            </div>
          </div>
          {/* Add basic sidebar menu here or import it if Sidebar exists */}
          <div className="menu-wrapper">
             <div className="menu">
                <button className="menu-item">Dashboard</button>
                <button className="menu-item active">Customers</button>
             </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="main-content">
          <div className="topbar">
             <div className="user-profile">
               <span className="user-name">Log Out</span>
             </div>
          </div>
          <div className="content-area">
            <Routes>
              <Route path="/" element={<Navigate to="/customers" replace />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/customers/:id" element={<CustomerDetail />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;