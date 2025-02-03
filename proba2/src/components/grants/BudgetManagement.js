import React from "react";
import { Link } from "react-router-dom";
import { Card, Button } from "react-bootstrap";

const BuddgetManagment = () => {
  return (
    <div className="container mt-4">
      <h2 className="mb-4">Budget Managemnt</h2>
      <p>Manage your budget. Create new expenses and edit existing ones.</p>
      
      <div className="d-flex gap-3 flex-wrap">
        <Card className="p-3" style={{ width: "18rem" }}>
          <Card.Body>
            <Card.Title>Add Expense</Card.Title>
            <Card.Text>Log new expenses related to your grant project.</Card.Text>
            <Link to="/expense/new">
              <Button variant="primary">Add</Button>
            </Link>
          </Card.Body>
        </Card>

        <Card className="p-3" style={{ width: "18rem" }}>
          <Card.Body>
            <Card.Title>View Budget Summary</Card.Title>
            <Card.Text>Review and analyze your project's financial summary. </Card.Text>
            <Link to="/budget">
              <Button variant="secondary">View Budget</Button>
            </Link>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default BuddgetManagment;