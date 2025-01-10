import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css'; 
import LoginForm from './components/Login_Register/LoginForm';
import Dashboard from './components/Dashboard/Dashboard';


function App() {

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LoginForm />} /> 
        <Route path="/login" element={<LoginForm />} />
        <Route path="/home" element={<Dashboard />} />

      </Routes>

    </div>
  );
}
export default App;