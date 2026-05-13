import "./App.css";
import logo from "./assets/CRM_logo.png";
import Sidebar from "./components/Sidebar";
import TaskKanban from "./pages/TaskKanban"; 

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

      {/* MAIN CONTENT AREA */}
      <div className="main-content">
        <TaskKanban />
      </div>

    </div>
  );
}

export default App;