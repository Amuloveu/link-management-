import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import './Sidebar.css';

export default function Sidebar() {
  const [sidebar, setSidebar] = useState(false);
  const showSidebar = () => setSidebar(!sidebar);

  return (
    <>
      {/* Navbar toggle button */}
      <div className="navbar">
        <FaIcons.FaBars className="menu-bars" onClick={showSidebar} />
      </div>

      {/* Sidebar */}
      <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
        <ul className="nav-menu-items" onClick={showSidebar}>
          <li className='navbar-toggle'>
            <AiIcons.AiOutlineClose className="menu-close" onClick={showSidebar} />
          </li>

          <li className="nav-text">
            <Link to="/dashboard"><FaIcons.FaHome /> <span>Dashboard</span></Link>
          </li>
          <li className="nav-text">
            <Link to="/links"><FaIcons.FaLink /> <span>Links</span></Link>
          </li>
          <li className="nav-text">
            <Link to='/links/add'><FaIcons.FaPlus /> <span>Add Link</span></Link>
          </li>
          <li className="nav-text">
            <Link to='/links/utm'><FaIcons.FaPlus /> <span>Generate UTM</span></Link>
          </li>
          <li className="nav-text">
            <Link to="/profile"><FaIcons.FaUser /> <span>Profile</span></Link>
          </li>
        </ul>
      </nav>
    </>
  );
}
