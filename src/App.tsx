import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './application/pages/home';
import Dev from './application/pages/dev';
import Layout from './application/components/layout';
import NotFound from './application/pages/not-found';
import Projects from './application/pages/projects';
import Splash from './application/pages/splash';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="" element={<Home />} />
        <Route path="/dev" element={<Dev />} />
      </Route>
      <Route path="/splash" element={<Splash />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
