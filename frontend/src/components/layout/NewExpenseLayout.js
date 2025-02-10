import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import NewExpenseSidebar from "./NewExpenseSidebar";
import { Outlet } from "react-router-dom";
import "../../css/NewExpenseLayout.css"; // Nowy plik CSS dla spójności

const NewExpenseLayout = () => {
  const [currentSection, setCurrentSection] = useState("general-information");

  return (
    <Container fluid className="expense-layout-container">
      {" "}
      {/* Nowa klasa CSS */}
      <Row>
        {/* Sidebar wniosków */}
        <Col className="expense-sidebar">
          <NewExpenseSidebar
            currentSection={currentSection}
            setCurrentSection={setCurrentSection}
          />
        </Col>

        {/* Dynamiczna zawartość (załadowane podstrony) */}
        <Col lg={9} md={8} sm={12} className="expense-content">
          <Outlet context={[currentSection, setCurrentSection]} />
        </Col>
      </Row>
    </Container>
  );
};

export default NewExpenseLayout;
