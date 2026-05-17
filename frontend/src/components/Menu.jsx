import { useNavigate, useLocation } from 'react-router-dom'

function Menu({ currentPage, setCurrentPage }) {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <nav className="menu">
      <button
        className={`menu-item ${location.pathname === '/' ? 'active' : ''}`}
        onClick={() => navigate('/')}
      >
        Dashboard ⌂
      </button>
      <button
        className={`menu-item ${location.pathname === '/pipeline' ? 'active' : ''}`}
        onClick={() => navigate('/pipeline')}
      >
        Sales Pipeline ⊷
      </button>
      <button className="menu-item">
        Tasks ☰
      </button>
      <button className="menu-item">
        Customers ⌘
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