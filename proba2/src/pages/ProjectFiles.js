import React from "react";
import { Link } from "react-router-dom";
import { Card, Button, Container } from "react-bootstrap";
import "../css/BudgetManagment.css"; // Import pliku CSS
import { useAuth } from "../hooks/AuthContext"; // Import useAuth to get user data

const ProjectFiles = () => {
  const { currentUser } = useAuth(); // Get current user info
  return (
    <Container className="budget-container">
      <h2 className="budget-title">Project Files</h2>
      <p className="budget-description">
        Manage your project files, upload new documents, and review existing
        records.
      </p>

      <div className="budget-card-container">
        <Card className="budget-card">
          <Card.Body>
            <Card.Title className="budget-card-title">
              Task Documents
            </Card.Title>
            <Card.Text className="budget-card-text">
              Add new documents related to your tasks.
            </Card.Text>
            <Link to="/documents/task">
              <Button variant="secondary">Task Documents</Button>
            </Link>
          </Card.Body>
        </Card>
        <Card className="budget-card">
          <Card.Body>
            <Card.Title className="budget-card-title">
              Team Documents
            </Card.Title>
            <Card.Text className="budget-card-text">
              Add new documents related to you.
            </Card.Text>
            <Link to="/documents/team">
              <Button variant="secondary">Team Documents</Button>
            </Link>
          </Card.Body>
        </Card>
        <Card className="budget-card">
          <Card.Body>
            <Card.Title className="budget-card-title">
              Budget Documents
            </Card.Title>
            <Card.Text className="budget-card-text">
              Add new documents related to budget.
            </Card.Text>
            <Link to="/documents/budget">
              <Button variant="secondary">Budget Documents</Button>
            </Link>
          </Card.Body>
        </Card>
        if (currentUser?.role == "admin")
        {
          <Card className="budget-card">
            <Card.Body>
              <Card.Title className="budget-card-title">
                File Admin Panel
              </Card.Title>
              <Card.Text className="budget-card-text">
                Browse and manage all project files.
              </Card.Text>
              <Link to="/documents/adminpanel">
                <Button variant="secondary">File Admin Panel</Button>
              </Link>
            </Card.Body>
          </Card>
        }
      </div>
    </Container>
  );
};

export default ProjectFiles;
