import React, {useState} from 'react'
import logo from './logo.svg';
import {BrowserRouter as Router, Route, Switch, Link, Redirect, Routes, BrowserRouter} from  'react-router-dom'
import './App.css';
import {Login} from './Login'
import {Register} from './Register'
import { Dashboard } from './Dashboard';
import { NavBar } from './NavBar';
import { Home } from './Home';
import { Friends } from './Friends';
function App() {
  const [currentForm, setCurrentForm] = useState('login');
  const [childVariable, setChildVariable] = useState([]);

  const ip = 'http://54.237.85.94:4000';
  const toggleForm = (formName) => {
    setCurrentForm(formName);
  }

  function handleChildVariableChange(variable) {
    console.log(variable)
    setChildVariable(variable);
  }



  return (
    <div className="App">
      <Routes>
        <Route exact path='/' element={<><NavBar /><Home /></>} />
        <Route exact path='/login' element={<><NavBar /><Login ip={ip}/></>} />
        <Route exact path='/register' element={<><NavBar /><Register ip = {ip}/></>} />
        <Route exact path='/dashboard' element={<Dashboard onVariableChange={handleChildVariableChange}  ip = {ip}/>} />
        <Route exact path='/friend' element={<Friends data={childVariable} />} />
      </Routes>
    </div>

  );
}

export default App;
