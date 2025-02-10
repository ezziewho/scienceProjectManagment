import React from "react";
import { Link } from "react-router-dom";
import { Card, Button, Container } from "react-bootstrap";
import "../../css/BudgetManagment.css"; // Import pliku CSS

const BuddgetManagment = () => {
  return (
    <Container className="budget-container">
      <h2 className="budget-title">Budget Management</h2>

      <div className="budget-card-container">
        <Card className="budget-card">
          <Card.Body>
            <Card.Title className="budget-card-title">Add Expense</Card.Title>
            <Card.Text className="budget-card-text">
              Log new expenses related to your science project.
            </Card.Text>
            <Link to="/expense/new">
              <Button variant="secondary">Add Expense</Button>
            </Link>
          </Card.Body>
        </Card>

        <Card className="budget-card">
          <Card.Body>
            <Card.Title className="budget-card-title">
              View Budget Summary
            </Card.Title>
            <Card.Text className="budget-card-text">
              Review and analyze your project's financial summary.
            </Card.Text>
            <Link to="/budget">
              <Button variant="secondary">View Budget</Button>
            </Link>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
};

export default BuddgetManagment;
