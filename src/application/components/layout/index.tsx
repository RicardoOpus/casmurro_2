import TitleBar from "../title-bar";
import { Outlet } from 'react-router-dom';

function Layout() {
  return (
    <>
      <div>
        <TitleBar />
        <Outlet />
      </div>
    </>
  );
}

export default Layout;
