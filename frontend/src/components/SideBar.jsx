import Menu from "./Menu";

function Sidebar() {
    return (
        <aside className="sidebar">

            <div className="menu-wrapper">

                <h2 className="menu-title">Menu</h2>

                <Menu/>

            </div>

        </aside>
    );
}

export default Sidebar;