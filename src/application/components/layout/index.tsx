import { Outlet } from 'react-router-dom';
import TitleBar from '../title-bar';
import NavBar from '../nav-bar';

function Layout() {
  return (
    <div>
      <TitleBar />
      <NavBar />
      <Outlet />
    </div>
  );
}

export default Layout;
