import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/Grants.css"; // Add your CSS for styling

function Grants() {
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <div className="grants-container">
            <h1>Grants Portal</h1>
            <p>Explore tools and features to help you efficiently apply for grants.</p>
            <div className="grants-boxes">
                <div className="grant-box" onClick={() => handleNavigation("/grants/database")}>
                    <h2>Grant Database</h2>
                    <p>Browse available funding programs in your field.</p>
                </div>
                <div className="grant-box" onClick={() => handleNavigation("/grants/management")}>
                    <h2>Application Management</h2>
                    <p>Manage your applications and track their status.</p>
                </div>
                <div className="grant-box" onClick={() => handleNavigation("/grants/automation")}>
                    <h2>Document Automation</h2>
                    <p>Create and organize your application documents effortlessly.</p>
                </div>
                <div className="grant-box" onClick={() => handleNavigation("/grants/guides")}>
                    <h2>Guides and Resources</h2>
                    <p>Learn how to prepare successful grant applications step by step.</p>
                </div>
            </div>
        </div>
    );
}

export default Grants;
