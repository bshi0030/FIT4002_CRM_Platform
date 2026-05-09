import "./App.css";
import logo from "./assets/CRM_logo.png";
import Sidebar from "./components/Sidebar";
import SalesPipeline from "./pages/SalesPipeline";

function App() {
  return (
    <div className="app-layout">

      {/* SIDEBAR */}
      <aside className="sidebar">

        {/* LOGO */}
        <div className="sidebar-top">
          <img src={logo} alt="CRM Logo" className="logo" />
          <div className="logo-text">
            <p>Next Generation CRM Platform</p>
          </div>
        </div>

        {/* MENU */}
        <Sidebar />

      </aside>

      {/* MAIN CONTENT */}
      <div className="main-content">

        {/* TOPBAR — empty, logout removed */}
        <div className="topbar">
        </div>

        {/* PAGE CONTENT */}
        <div className="content-area">
          <SalesPipeline />
        </div>

      </div>

    </div>
  );
}

export default App;