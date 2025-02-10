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

      <div className="budget-card-container">
        <Card className="budget-card">
          <Card.Body>
            <Card.Title className="budget-card-title">
              Task-Related Files
            </Card.Title>
            <Card.Text className="budget-card-text">
              Store and manage files related to tasks, such as reports and
              attachments.
            </Card.Text>
            <Link to="/documents/task">
              <Button variant="secondary">Manage Task Files</Button>
            </Link>
          </Card.Body>
        </Card>
        <Card className="budget-card">
          <Card.Body>
            <Card.Title className="budget-card-title">
              User Documents
            </Card.Title>
            <Card.Text className="budget-card-text">
              Keep track of personal documents like CVs, publications, and
              certificates.
            </Card.Text>
            <Link to="/documents/team">
              <Button variant="secondary">Manage Personal Documents</Button>
            </Link>
          </Card.Body>
        </Card>
        <Card className="budget-card">
          <Card.Body>
            <Card.Title className="budget-card-title">
              Financial and Budget Records
            </Card.Title>
            <Card.Text className="budget-card-text">
              Manage invoices, purchase receipts, and service confirmations.
            </Card.Text>
            <Link to="/documents/budget">
              <Button variant="secondary">Manage Budget Documents</Button>
            </Link>
          </Card.Body>
        </Card>
        {currentUser?.role === "admin" && (
          <Card className="budget-card">
            <Card.Body>
              <Card.Title className="budget-card-title">
                Project File Management
              </Card.Title>
              <Card.Text className="budget-card-text">
                View, edit, and manage all project files in one place.
              </Card.Text>
              <Link to="/documents/adminpanel">
                <Button variant="secondary">File Admin Panel</Button>
              </Link>
            </Card.Body>
          </Card>
        )}
      </div>
    </Container>
  );
};

export default ProjectFiles;
