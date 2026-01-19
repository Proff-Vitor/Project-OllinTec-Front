import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login/Login';
import Home from './pages/Home/Home';
import RegisterUser from './pages/RegisterUser/RegisterUser';
import RegisterSector from './pages/RegisterSector/RegisterSector';
import RegisterEquipment from './pages/RegisterEquipment/RegisterEquipment';
import CreateOs from './pages/CreateOS/CreateOS';
import ViewOs from './pages/ViewOS/ViewOS';
import FiltroRelatorio from './pages/FiltroRelatorio/FiltroRelatorio';
import ProtectedRoute from './components/ProtectedRoute';
import Menu from './components/Menu/Menu';
import { useSelector } from 'react-redux';
import { RootState } from './store/store';

function App() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <Router>
      {isAuthenticated && <Menu />}
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/home' element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }/>
        <Route path='/registerUser' element={
          <ProtectedRoute>
            <RegisterUser />
          </ProtectedRoute>
        }/>
        <Route path='/registerSector' element={
          <ProtectedRoute>
            <RegisterSector/>
          </ProtectedRoute>
        }/>
        <Route path='/registerEquipment' element={
          <ProtectedRoute>
            <RegisterEquipment/>
          </ProtectedRoute>
        }/>
        <Route path='/createOs' element={
          <ProtectedRoute>
            <CreateOs/>
          </ProtectedRoute>
        }/>
        <Route path='/viewOs' element={
          <ProtectedRoute>
            <ViewOs/>
          </ProtectedRoute>
        }/>
        <Route path='/relatorio' element={
          <ProtectedRoute>
            <FiltroRelatorio/>
          </ProtectedRoute>
        }/>
      </Routes>
    </Router>
  );
}

export default App;
