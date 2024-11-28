import './App.css';
import Login from './pages/Login.js';
import Signup from './pages/Signup.js';
import ForgotPassword from './pages/ForgotPassword.js';
import Home from './pages/Home.js';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar'; // Import the Navbar

function App() {
  return (
    <BrowserRouter>
    <Navbar />
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
