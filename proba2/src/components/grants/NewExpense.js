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

  // Odczytywanie danych z localStorage (bez pliku)
  const [formData, setFormData] = useState(() => {
    const savedData = JSON.parse(localStorage.getItem("draftExpense")) || {};
    return savedData;
  });

  useEffect(() => {
    // Odczytujemy plik z `sessionStorage`
    const savedFileData = sessionStorage.getItem("expenseFile");
    if (savedFileData) {
      const fileBlob = JSON.parse(savedFileData);
      const file = new File([fileBlob.data], fileBlob.name, {
        type: fileBlob.type,
        lastModified: fileBlob.lastModified,
      });

      console.log("📂 Przywrócony plik z sessionStorage:", file);

      setFormData((prevData) => ({ ...prevData, file }));
    }
  }, []);

  console.log("🔍 Otrzymane formData w NewExpense.js:", formData);
  console.log("📂 Plik w formData:", formData.file);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("🔍 Aktualny stan formData:", formData);

      const { file, file_description, ...otherData } = formData;

      // Dane do pierwszego requesta (bez pliku)
      const requestData = {
        cat: section,
        user_id: String(currentUser.id),
        ...otherData,
      };

      console.log("🚀 Wysyłanie danych do backendu:", requestData);

      // ✅ 1️⃣ Wysyłamy dane wydatku do `/budget/create`
      const response = await axios.post(
        "http://localhost:8081/budget/create",
        requestData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 201) {
        console.log("✅ Sukces! Odpowiedź serwera:", response.data);

        if (!file) {
          console.warn("⚠️ Brak pliku do przesłania!");
        } else {
          // ✅ 2️⃣ Wysyłamy plik do `/budget/upload-file`
          console.log("📂 Wybrany plik przed dodaniem do FormData:", file);

          const formDataUpload = new FormData();
          formDataUpload.append("expense_id", response.data.id);
          formDataUpload.append("category", section);
          formDataUpload.append("file", file);
          formDataUpload.append("file_description", file_description || "");
          formDataUpload.append("uploaded_by", currentUser.id);

          console.log("📂 Dane w FormData przed wysyłką:", [
            ...formDataUpload.entries(),
          ]);

          const fileResponse = await axios.post(
            "http://localhost:8081/document/upload/expense_files",
            formDataUpload,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );

          if (fileResponse.status === 201) {
            console.log("✅ Plik przesłany pomyślnie:", fileResponse.data);
          } else {
            console.error(
              "❌ Błąd przy przesyłaniu pliku:",
              fileResponse.status
            );
          }
        }

        // Czyszczenie draftu i przekierowanie
        localStorage.removeItem("draftExpense");
        sessionStorage.removeItem("expenseFile");
        navigate("/expenses/list");
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
