import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { useAuth } from "../../hooks/AuthContext"; // Import useAuth to get user data

const BudgetDocuments = () => {
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [expenseId, setExpenseId] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [expenseFiles, setExpenseFiles] = useState([]);

  const { currentUser } = useAuth(); // Get current user info

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8081/document/files/expense"
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Błąd pobierania kategorii budżetowych:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchExpenses = async () => {
      if (!category) return;
      try {
        const response = await axios.get(
          `http://localhost:8081/budget/${category}`
        );
        setExpenses(response.data);
      } catch (error) {
        console.error("Błąd pobierania wydatków:", error);
      }
    };
    fetchExpenses();
  }, [category]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const formatCategory = (cat) => {
    return cat
      .replace(/_/g, " ") // Zamienia _ na spacje
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Zamienia pierwszą literę każdego słowa na wielką
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !category || !expenseId) {
      setMessage("❌ Wybierz plik, kategorię i wydatek przed wysłaniem.");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", category);
    formData.append("expense_id", expenseId);
    formData.append("uploaded_by", currentUser.id); // Zmień na rzeczywiste ID użytkownika
    formData.append("file_description", description);
    try {
      const response = await axios.post(
        "http://localhost:8081/document/upload/expense_files",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setMessage(`✅ Sukces! Plik przesłany: ${response.data.file.fileName}`);
      setFile(null);
      setCategory("");
      setExpenseId("");
      setDescription("");
      handleFetchFiles(); // Odśwież listę plików po przesłaniu
    } catch (error) {
      console.error("❌ Błąd przesyłania pliku:", error);
      setMessage("❌ Błąd podczas przesyłania pliku.");
    }
  };

  const handleFetchFiles = async () => {
    if (!category || !expenseId) {
      setMessage("📌 Wybierz kategorię i wydatek, aby pobrać pliki.");
      return;
    }
    try {
      const response = await axios.get(
        `http://localhost:8081/document/files/expense/${category}/${expenseId}`
      );
      setExpenseFiles(response.data.files);
    } catch (error) {
      console.error("Błąd pobierania plików:", error);
      setMessage("❌ Błąd podczas pobierania plików.");
    }
  };

  const handleDownloadFile = async (fileId, fileName) => {
    try {
      const response = await axios.get(
        `http://localhost:8081/document/download/expense/${fileId}`,
        { responseType: "blob" } // Pobieramy jako binarny plik
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Błąd pobierania pliku:", error);
      setMessage("❌ Nie udało się pobrać pliku.");
    }
  };

  const handleDeleteFile = async (fileId) => {
    try {
      await axios.delete(
        `http://localhost:8081/document/delete/expense/${fileId}`
      );
      setExpenseFiles(expenseFiles.filter((file) => file.id !== fileId));
      setMessage("🗑️ Plik został usunięty.");
    } catch (error) {
      console.error("Błąd usuwania pliku:", error);
      setMessage("❌ Nie udało się usunąć pliku.");
    }
  };

  return (
    <Container>
      <h2>📄 Prześlij dokument budżetowy</h2>
      {message && (
        <Alert variant={message.includes("✅") ? "success" : "danger"}>
          {message}
        </Alert>
      )}
      <Form onSubmit={handleUpload}>
        <Form.Group>
          <Form.Label>📂 Wybierz plik</Form.Label>
          <Form.Control type="file" onChange={handleFileChange} required />
        </Form.Group>
        <Form.Group>
          <Form.Label>📌 Wybierz kategorię</Form.Label>
          <Form.Control
            as="select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">-- Wybierz kategorię --</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {formatCategory(cat)}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.Label>📌 Wybierz wydatek</Form.Label>
          <Form.Control
            as="select"
            value={expenseId}
            onChange={(e) => setExpenseId(e.target.value)}
            required
          >
            <option value="">-- Wybierz wydatek --</option>
            {expenses.map((expense) => (
              <option key={expense.id} value={expense.id}>
                {expense.name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.Label>📝 Opis (opcjonalnie)</Form.Label>
          <Form.Control
            as="textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>
        <Button type="submit">🚀 Wyślij plik</Button>
      </Form>
      <hr />
      <Button variant="secondary" onClick={handleFetchFiles}>
        📂 Pobierz pliki
      </Button>
      <hr />
      <h3>📌 Wybierz kategorię i wydatek, aby zobaczyć pliki</h3>
      <ul className="list-group mt-3">
        {expenseFiles.length === 0 ? (
          <p>Brak plików dla wybranego wydatku.</p>
        ) : (
          expenseFiles.map((file) => (
            <li
              key={file.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <span>
                <strong>{file.file_name}</strong>
                {file.description && (
                  <p className="mb-0">📝 {file.description}</p>
                )}
              </span>
              <div>
                <button
                  className="btn btn-sm btn-success me-2"
                  onClick={() => handleDownloadFile(file.id, file.file_name)}
                >
                  ⬇️ Pobierz
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDeleteFile(file.id)}
                >
                  🗑️ Usuń
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </Container>
  );
};

export default BudgetDocuments;
