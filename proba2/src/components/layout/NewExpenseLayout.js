import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import NewExpenseSidebar from "./NewExpenseSidebar";
import { Outlet } from "react-router-dom";

const NewExpenseLayout = () => {
  const [currentSection, setCurrentSection] = useState("general-information");

  return (
    <Container fluid className="mt-4">
      <Row>
        {/* Sidebar wniosków */}
        <Col md={3}>
          <NewExpenseSidebar
            currentSection={currentSection}
            setCurrentSection={setCurrentSection}
          />
        </Col>

        {/* Dynamiczna zawartość (załadowane podstrony) */}
        <Col md={9}>
          <Outlet context={[currentSection, setCurrentSection]} />
        </Col>
      </Row>
    </Container>
  );
};

export default NewExpenseLayout;
