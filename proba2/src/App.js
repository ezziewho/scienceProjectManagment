import './css/App.css';
import Login from './pages/Login.js';
import Signup from './pages/Signup.js';
import ForgotPassword from './pages/ForgotPassword.js';
import Home from './pages/Home.js';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/layout/Navbar'; // Import the Navbar
import KanbanPage from './pages/KanbanPage.js';
import About from './pages/About.js';
import Contact from './pages/Contact.js';
import Team from './pages/Team.js';
import { AuthProvider } from "./hooks/AuthContext";

function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
    <Navbar />
      <Routes>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/signup' element={<Signup/>}></Route>
        <Route path='/ForgotPassword' element={<ForgotPassword/>}></Route>
        <Route path='/' element={<Home/>}></Route>
        <Route path="/kanban" element={<KanbanPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/team" element={<Team />} />
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
