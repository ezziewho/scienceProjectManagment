import React from "react";
import { ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../../css/NewExpenseSidebar.css";

const sections = [
  { id: "equipment", label: "Equipment and Software" },
  { id: "services", label: "External Services" },
  { id: "indirect_costs", label: "Indirect Costs" },
  { id: "open_access", label: "Open Access" },
  { id: "salaries", label: "Salaries and Scholarships" },
  { id: "travel", label: "Travel Costs" },
  { id: "others", label: "Other Expenses" },
];

const NewExpenseSidebar = ({ currentSection, setCurrentSection }) => {
  return (
    <div className="sidebar">
      <h4 className="sidebar-title"> Categories</h4>
      <ListGroup>
        {sections.map((section) => (
          <ListGroup.Item
            key={section.id}
            action
            as={Link}
            to={`/expense/new/${section.id}`}
          >
            {section.label}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default NewExpenseSidebar;
