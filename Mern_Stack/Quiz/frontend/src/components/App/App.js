import './App.css';
import Nav from '../Nav/Nav';
import Main from '../Main/Main';
import { light, dark } from '../../classes/Mode';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from '../Login/Login';
import Signup from '../Signup/Signup';
import Dash from '../Dashboard/Dash';
import Creator from '../Creator/Creator';
import QuizApp from '../Quiz/QuizApp';
import Account from '../Account/Account';


function App() {
  const [mode, setMode] = useState(light);
  const [isDark, setDark] = useState(false);
  const [profile, setProfile] = useState(null);
  useEffect(() => { swithMode(isDark, setMode) }, [isDark]);
  
  return (
    <Router>
      <Nav mode={mode} change={() => { setDark(!isDark) }} profile = {profile} setProfile={setProfile}/>
      <Routes>
        <Route exact path='/' element={<Main mode={mode} profile={profile}/>}></Route>
        <Route exact path='/login' element={<Login mode={mode} profile = {profile} setProfile={setProfile}/>}></Route>
        <Route exact path='/reg' element={<Signup mode={mode} profile={profile}/>}></Route>
        <Route exact path='/dashboard' element={<Dash mode={mode} profile={profile}/>}></Route>
        <Route exact path='/create' element={<Creator mode={mode} profile={profile}/>}></Route>
        <Route exact path='/quiz' element={<QuizApp mode={mode} profile={profile}/>}></Route>
        <Route exact path='/account' element={<Account mode={mode} profile={profile}/>}></Route>
      </Routes>
    </Router>

  );
}

export default App;

function swithMode(isDark, setMode) {
  if (isDark) {
    setMode(dark);
    let x = document.getElementsByClassName('modeImg');
    for (let i = 0; i < x.length; i++) {
      x.item(i).style.transform = "translateX(0%)";
      x.item(i).style.filter = "none";
    }
    document.getElementById('logo').style.filter = 'none';
  }
  else {
    setMode(light);
    let x = document.getElementsByClassName('modeImg');
    for (let i = 0; i < x.length; i++) {
      x.item(i).style.transform = "translateX(-100%)";
      x.item(i).style.filter = "invert()";
    }
    document.getElementById('logo').style.filter = 'invert()';
  }
}