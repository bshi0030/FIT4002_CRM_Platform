import "./App.css";
import logo from "./assets/CRM_logo.png";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <div className="app-layout">
        {/* LOGO */}
        <div className="sidebar-top">
          <img src={logo} alt="CRM Logo" className="logo" />

          <div className="logo-text">
            <p>Next Generation CRM Platform</p>
          </div>
        </div>

    </div>
  );
}

export default App;