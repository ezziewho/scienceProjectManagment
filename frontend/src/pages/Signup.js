// import React, { useState } from "react";
// import axios from "axios";
// import { Link, useNavigate } from "react-router-dom";
// import Validation from "../components/forms/SignupValidation";
// import "../css/Signup.css"; // Import the custom CSS

// function Signup() {
//   const [values, setValues] = useState({
//     name: "",
//     email: "",
//     password: "",
//     teamId: "",
//     teamName: "",
//   });

//   const navigate = useNavigate();
//   const [errors, setErrors] = useState({});
//   const [joinTeam, setJoinTeam] = useState(false);
//   const [createTeam, setCreateTeam] = useState(false);

//   const handleInput = (event) => {
//     setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }));
//   };

//   const handleCheckboxChange = (event) => {
//     const { name, checked } = event.target;
//     if (name === "createTeam") {
//       setCreateTeam(checked);
//       if (checked) setJoinTeam(false);
//     } else if (name === "joinTeam") {
//       setJoinTeam(checked);
//       if (checked) setCreateTeam(false);
//     }
//   };

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     setErrors(Validation(values));
//     if (
//       errors.name === "" &&
//       errors.email === "" &&
//       errors.password === "" &&
//       (createTeam || joinTeam)
//     ) {
//       axios
//         .post("http://localhost:8081/auth/signup", values)
//         .then((res) => {
//           navigate("/login");
//         })
//         .catch((err) => console.log(err));
//     }
//   };

//   return (
//     <div className="signup-background">
//       <div className="signup-container">
//         <div className="signup-card">
//           <h2 className="text-center">Sign Up</h2>
//           <form onSubmit={handleSubmit}>
//             <div className="mb-3">
//               <label htmlFor="name">Name</label>
//               <input
//                 type="text"
//                 placeholder="Enter Name"
//                 name="name"
//                 onChange={handleInput}
//                 className="form-control"
//               />
//               {errors.name && (
//                 <span className="text-danger">{errors.name}</span>
//               )}
//             </div>
//             <div className="mb-3">
//               <label htmlFor="email">Email</label>
//               <input
//                 type="email"
//                 placeholder="Enter Email"
//                 name="email"
//                 onChange={handleInput}
//                 className="form-control"
//               />
//               {errors.email && (
//                 <span className="text-danger">{errors.email}</span>
//               )}
//             </div>
//             <div className="mb-3">
//               <label htmlFor="password">Password</label>
//               <input
//                 type="password"
//                 placeholder="Enter Password"
//                 name="password"
//                 onChange={handleInput}
//                 className="form-control"
//               />
//               {errors.password && (
//                 <span className="text-danger">{errors.password}</span>
//               )}
//             </div>
//             <div className="text-decoration-underline text-light d-block text-center">
//               <label>
//                 <input
//                   type="checkbox"
//                   name="createTeam"
//                   checked={createTeam}
//                   onChange={handleCheckboxChange}
//                   //checked={showAllTasks}
//                   //onChange={(e) => setShowAllTasks(e.target.checked)}
//                 />
//                 Create a new team as a Principal Investigator
//               </label>
//             </div>
//             <p></p>
//             <div className="text-decoration-underline text-light d-block text-center">
//               <label>
//                 <input
//                   type="checkbox"
//                   name="joinTeam"
//                   checked={joinTeam}
//                   onChange={handleCheckboxChange}
//                   //onChange={(e) => setJoinTeam(e.target.checked)}
//                 />
//                 Join an existing Team
//               </label>
//             </div>
//             {joinTeam && (
//               <div className="mb-3">
//                 <label htmlFor="name">Team ID</label>
//                 <input
//                   type="text"
//                   placeholder="Enter Team ID"
//                   name="teamId"
//                   onChange={handleInput}
//                   className="form-control"
//                 />
//               </div>
//             )}
//             {createTeam && (
//               <div className="mb-3">
//                 <label htmlFor="name">Team Name</label>
//                 <input
//                   type="text"
//                   placeholder="Enter Team Name"
//                   name="teamName"
//                   onChange={handleInput}
//                   className="form-control"
//                 />
//               </div>
//             )}
//             <p></p>
//             <button type="submit" className="btn btn-primary w-100">
//               Sign Up
//             </button>
//             <p></p>
//             <Link
//               to="/login"
//               className="btn btn-outline-light w-100 text-decoration-none"
//             >
//               Log In
//             </Link>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Signup;

import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Validation from "../components/forms/SignupValidation";
import "../css/Signup.css"; // Import the custom CSS

function Signup() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    teamId: "",
    teamName: "",
  });

  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [joinTeam, setJoinTeam] = useState(false);
  const [createTeam, setCreateTeam] = useState(false);

  const handleInput = (event) => {
    setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    if (name === "createTeam") {
      setCreateTeam(checked);
      if (checked) setJoinTeam(false);
    } else if (name === "joinTeam") {
      setJoinTeam(checked);
      if (checked) setCreateTeam(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrors(Validation(values));
    if (
      errors.name === "" &&
      errors.email === "" &&
      errors.password === "" &&
      (createTeam || joinTeam) &&
      (createTeam ? values.teamName !== "" : values.teamId !== "")
    ) {
      const userData = {
        name: values.name,
        email: values.email,
        password: values.password,
        team_id: joinTeam ? values.teamId : null, // Jeśli dołącza, przekazuje teamId
        team_name: createTeam ? values.teamName : null, // Jeśli tworzy, przekazuje teamName
        role: createTeam ? "manager" : "user", // Rola na podstawie wyboru
      };

      console.log("Sending data to backend:", userData); // Log the data being sent

      axios
        .post("http://localhost:8081/auth/signup", userData)
        .then((res) => {
          navigate("/login");
        })
        .catch((err) => console.log(err));
    } else {
      if (createTeam && values.teamName === "") {
        setErrors((prev) => ({ ...prev, teamName: "Team Name is required" }));
      }
      if (joinTeam && values.teamId === "") {
        setErrors((prev) => ({ ...prev, teamId: "Team ID is required" }));
      }
    }
  };

  return (
    <div className="signup-background">
      <div className="signup-container">
        <div className="signup-card">
          <h2 className="text-center">Sign Up</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                placeholder="Enter Name"
                name="name"
                onChange={handleInput}
                className="form-control"
              />
              {errors.name && (
                <span className="text-danger">{errors.name}</span>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                placeholder="Enter Email"
                name="email"
                onChange={handleInput}
                className="form-control"
              />
              {errors.email && (
                <span className="text-danger">{errors.email}</span>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                placeholder="Enter Password"
                name="password"
                onChange={handleInput}
                className="form-control"
              />
              {errors.password && (
                <span className="text-danger">{errors.password}</span>
              )}
            </div>
            <div className="text-decoration-underline text-light d-block text-center">
              <label>
                <input
                  type="checkbox"
                  name="createTeam"
                  checked={createTeam}
                  onChange={handleCheckboxChange}
                  //checked={showAllTasks}
                  //onChange={(e) => setShowAllTasks(e.target.checked)}
                />
                Create a new team as a Principal Investigator
              </label>
            </div>
            <p></p>
            <div className="text-decoration-underline text-light d-block text-center">
              <label>
                <input
                  type="checkbox"
                  name="joinTeam"
                  checked={joinTeam}
                  onChange={handleCheckboxChange}
                  //onChange={(e) => setJoinTeam(e.target.checked)}
                />
                Join an existing Team
              </label>
            </div>
            {joinTeam && (
              <div className="mb-3">
                <label htmlFor="name">Team ID</label>
                <input
                  type="text"
                  placeholder="Enter Team ID"
                  name="teamId"
                  onChange={handleInput}
                  className="form-control"
                />
              </div>
            )}
            {createTeam && (
              <div className="mb-3">
                <label htmlFor="name">Team Name</label>
                <input
                  type="text"
                  placeholder="Enter Team Name"
                  name="teamName"
                  onChange={handleInput}
                  className="form-control"
                />
              </div>
            )}
            <p></p>
            <button type="submit" className="btn btn-primary w-100">
              Sign Up
            </button>
            <p></p>
            <Link
              to="/login"
              className="btn btn-outline-light w-100 text-decoration-none"
            >
              Log In
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
