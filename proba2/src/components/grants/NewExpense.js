import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import axios from "axios";
import sections from "./sections"; // ✅ Jeden plik z wszystkimi sekcjami
import { useAuth } from "../../hooks/AuthContext"; // Import useAuth to get user data

const NewExpense = () => {
  const navigate = useNavigate();
  const { section = "equipment" } = useParams();
  const CurrentSectionComponent = sections[section] || sections["equipment"];
  const { currentUser } = useAuth(); // Get current user info

  // Stan formularza
  const [formData, setFormData] = useState(
    JSON.parse(localStorage.getItem("draftExpense")) || {}
  );

  // Auto-save do LocalStorage co 2 sekundy
  useEffect(() => {
    const saveInterval = setInterval(() => {
      localStorage.setItem("draftExpense", JSON.stringify(formData));
    }, 2000);

    return () => clearInterval(saveInterval);
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Tworzymy nowy obiekt, dodając category na podstawie sekcji
      const requestData = {
        cat: section,
        user_id: String(currentUser.id),
        ...formData,
      };

      // Logowanie wysyłanych danych
      console.log("🚀 Wysyłanie danych do backendu:", requestData);
      console.log("🚀 user.id:", requestData.user_id);

      const response = await axios.post(
        "http://localhost:8081/budget/create", // ✅ Wysyłamy do `/budget/`
        requestData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 201) {
        // ✅ 201 Created (poprawna odpowiedź)
        console.log("✅ Sukces! Odpowiedź serwera:", response.data);
        localStorage.removeItem("draftExpense");
        navigate("/expenses/list"); // ✅ Przekierowanie po zapisaniu
      } else {
        console.error("❌ Błąd zapisu wydatku. Status:", response.status);
      }
    } catch (error) {
      console.error("❌ Request failed:", error);
    }
  };

  return (
    <Container fluid className="mt-4">
      <Row>
        <Col md={12}>
          <h2>Add New Expense</h2>
          <CurrentSectionComponent
            formData={formData}
            setFormData={setFormData}
          />
          <Button variant="primary" className="mt-3" onClick={handleSubmit}>
            Save
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default NewExpense;
