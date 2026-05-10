import Menu from "./Menu";

function Sidebar({ currentPage, setCurrentPage }) {
  return (
    <aside className="sidebar">

    <div className="menu-wrapper">

      <h2 className="menu-title">Menu</h2>

      <Menu currentPage={currentPage} setCurrentPage={setCurrentPage} />

    </div>

    </aside>
  );
}

export default Sidebar;