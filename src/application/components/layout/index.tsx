import { Outlet } from 'react-router-dom';
import TitleBar from '../title-bar';

function Layout() {
  return (
    <div>
      <TitleBar />
      <Outlet />
    </div>
  );
}

export default Layout;
