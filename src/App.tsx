import { useEffect } from 'react'
import db from './services/dexieDB'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/home';
import DevScripts from './scripts/devScripts'
import Layout from './components/layout';
import NotFound from './pages/not-found';


function App() {
  useEffect(() => {
    db.projects.toArray().then((result) => {
      console.log(result);
    });
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="" element={<Home />} />
          <Route path="/dev" element={<DevScripts />} />
        </Route>
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
