import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Admin from "./Admin";
import Visitor from "./Visitor";

function Home() {
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Ensure credentials are sent with requests
  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios
      .get("http://localhost:8081/user/checkauth")
      .then((res) => {
        if (res.data.valid) {
          setRole(res.data.role);
        } else {
          navigate("/login"); // Redirect to login if not authenticated
        }
      })
      .catch((err) => {
        console.error("Error during authentication check:", err);
        navigate("/login");
      })
      .finally(() => {
        setLoading(false); // End loading state
      });
  }, [navigate]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Welcome, {role}</h1>
      <h2>Home</h2>
      {role === "manager" && <Admin />}
      {role === "visitor" && <Visitor />}
    </div>
  );
}

export default Home;
