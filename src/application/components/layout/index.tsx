import { Outlet } from 'react-router-dom';
import TitleBar from '../title-bar';
import NavBar from '../nav-bar';
import SideBar from '../side-bar';
import './layout.css';

function Layout() {
  return (
    <div>
      <TitleBar />
      <NavBar />
      <div className="mainContent">
        <SideBar />
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
