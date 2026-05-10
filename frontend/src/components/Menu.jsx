function Menu({ currentPage, setCurrentPage }) {
  return (
    <nav className="menu">

      <button 
        className={`menu-item ${currentPage === "home" || currentPage === "Dashboard" ? "active" : ""}`} 
        onClick={() => setCurrentPage("home")}
      >
        Dashboard ⌂
      </button>

      <button 
        className={`menu-item ${currentPage === "customer-list" || currentPage === "customer-profile" ? "active" : ""}`}
        onClick={() => setCurrentPage("customer-list")}
      >
        Customers ⌘
      </button>

      <button className="menu-item">
        Sales Pipeline ⊷
      </button>

      <button className="menu-item">
        Tasks ☰
      </button>

      <button className="menu-item">
        Calendar ◫
      </button>

      <button className="menu-item">
        Settings ⚙
      </button>

    </nav>
  );
}

export default Menu;