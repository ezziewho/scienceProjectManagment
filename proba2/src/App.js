import "./css/App.css";
import Login from "./pages/Login.js";
import Signup from "./pages/Signup.js";
import ForgotPassword from "./pages/ForgotPassword.js";
import Home from "./pages/Home.js";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/layout/Navbar"; // Import the Navbar
import KanbanPage from "./pages/KanbanPage.js";

import Team from "./pages/Team.js";
import { AuthProvider } from "./hooks/AuthContext";

import BudgetManagement from "./components/grants/BudgetManagement.js";
import NewExpense from "./components/grants/NewExpense.js";
import Profile from "./pages/Profile.js";
import NewExpenseLayout from "./components/layout/NewExpenseLayout.js"; // Importujemy nowy layout
import AdminLeavePanel from "./pages/AdminLeavePanel";
import Budget from "./pages/Budget.js";
import ProjectFiles from "./pages/ProjectFiles.js";
import NotLoggedIn from "./pages/NotLoggedIn.js";
import BudgetDocuments from "./components/documents/BudgetDocuments.js";
import TeamDocuments from "./components/documents/TeamDocuments.js";
import TaskDocuments from "./components/documents/TaskDocuments.js";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/not-logged-in" element={<NotLoggedIn />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
          <Route path="/ForgotPassword" element={<ForgotPassword />}></Route>
          <Route path="/" element={<Home />}></Route>
          <Route path="/kanban" element={<KanbanPage />} />
          <Route path="/team" element={<Team />} />
          <Route path="/expense" element={<BudgetManagement />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/projectfiles" element={<ProjectFiles />} />
          <Route path="/admin/leaves" element={<AdminLeavePanel />} />
          <Route path="/documents/budget" element={<BudgetDocuments />} />
          <Route path="/documents/team" element={<TeamDocuments />} />
          <Route path="/documents/task" element={<TaskDocuments />} />
          <Route path="/documents/budget" element={<BudgetDocuments />} />

          <Route path="/expense" element={<NewExpenseLayout />}>
            <Route path="new/:section?" element={<NewExpense />} />{" "}
            {/* ✅ Dynamiczna sekcja */}
          </Route>

          <Route path="/profile" element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
