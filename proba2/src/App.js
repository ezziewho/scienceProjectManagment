import './App.css';
import Login from './Login.js';
import Signup from './Signup.js';
import ForgotPassword from './ForgotPassword.js';
import Home from './Home.js';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/signup' element={<Signup/>}></Route>
        <Route path='/ForgotPassword' element={<ForgotPassword/>}></Route>
        <Route path='/home' element={<Home/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
