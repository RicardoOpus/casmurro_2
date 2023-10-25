import { useState } from 'react';
import './side-bar.css';

function SideBar() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const sidebarWidth = isSidebarOpen ? 'block' : 'none';

  return (
    <div className="sideBar">
      <button className="hideShowArrows" type="button" onClick={toggleSidebar}>
        {isSidebarOpen ? '❮❮' : '❯❯'}
      </button>

      <div className="sideBarContent" style={{ display: sidebarWidth }}>
        {isSidebarOpen && (
          <div>
            <h3>RESUMO</h3>
            {/* Outros conteúdos da barra lateral */}
          </div>
        )}
      </div>
    </div>
  );
}

export default SideBar;
