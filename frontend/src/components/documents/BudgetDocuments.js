import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { useAuth } from "../../hooks/AuthContext"; // Import useAuth to get user data
import "../../css/TaskDocuments.css";
import { IconDownload, IconTrash } from "@tabler/icons-react";

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
        console.error("Error fetching budget categories:", error);
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
        console.error("Error fetching expenses:", error);
      }
    };
    fetchExpenses();
  }, [category]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const formatCategory = (category) => {
    return category
      .replace(/_/g, " ") // Replace underscores with spaces
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize the first letter of each word
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !category || !expenseId) {
      setMessage(
        "Error: Please select a file, category, and expense before submitting."
      );
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", category);
    formData.append("expense_id", expenseId);
    formData.append("uploaded_by", currentUser.id);
    formData.append("file_description", description);
    try {
      const response = await axios.post(
        "http://localhost:8081/document/upload/expense_files",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setMessage(`Success! File uploaded: ${response.data.file.fileName}`);
      setFile(null);
      setCategory("");
      setExpenseId("");
      setDescription("");
      handleFetchFiles(); // Refresh file list after upload
    } catch (error) {
      console.error("File upload error:", error);
      setMessage("Error: File upload failed.");
    }
  };

  const handleFetchFiles = async () => {
    if (!category || !expenseId) {
      setMessage("Please select a category and expense to fetch files.");
      return;
    }
    try {
      const response = await axios.get(
        `http://localhost:8081/document/files/expense/${category}/${expenseId}`
      );
      setExpenseFiles(response.data.files);
    } catch (error) {
      console.error("Error fetching files:", error);
      setMessage("Error: Unable to fetch files.");
    }
  };

  const handleDownloadFile = async (fileId, fileName) => {
    try {
      const response = await axios.get(
        `http://localhost:8081/document/download/expense/${fileId}`,
        { responseType: "blob" } // Download as a binary file
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("File download error:", error);
      setMessage("Error: Unable to download file.");
    }
  };

  const handleDeleteFile = async (fileId) => {
    try {
      await axios.delete(
        `http://localhost:8081/document/delete/expense/${fileId}`
      );
      setExpenseFiles(expenseFiles.filter((file) => file.id !== fileId));
      setMessage("File has been deleted.");
    } catch (error) {
      console.error("File deletion error:", error);
      setMessage("Error: Unable to delete file.");
    }
  };

  return (
    <div className="task-documents-container">
      {/* Sekcja wyboru kategorii i wyświetlania plików */}
      <div className="task-documents-section">
        <h2>Select Category & Expense</h2>
        <Form.Group className="mb-3">
          <Form.Label>Select Category</Form.Label>
          <Form.Control
            as="select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">-- Select Category --</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {formatCategory(cat)}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Select Expense</Form.Label>
          <Form.Control
            as="select"
            value={expenseId}
            onChange={(e) => setExpenseId(e.target.value)}
            required
          >
            <option value="">-- Select Expense --</option>
            {expenses.map((expense) => (
              <option key={expense.id} value={expense.id}>
                {expense.name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Button variant="secondary" onClick={handleFetchFiles}>
          Show Files
        </Button>

        <ul className="list-group mt-3">
          {expenseFiles.length === 0 ? (
            <p>No files available for the selected expense.</p>
          ) : (
            expenseFiles.map((file) => (
              <li
                key={file.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <span>
                  <strong>{file.file_name}</strong>
                  {file.description && (
                    <p className="mb-0">{file.description}</p>
                  )}
                </span>
                <div>
                  <div className="file-actions">
                    <Button
                      variant="success"
                      size="sm"
                      className="me-2"
                      onClick={() =>
                        handleDownloadFile(file.id, file.file_name)
                      }
                    >
                      <IconDownload />
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteFile(file.id)}
                    >
                      <IconTrash />
                    </Button>
                    <span
                      className={`badge ${
                        file.phase === false
                          ? "bg-primary"
                          : file.phase === "In Progress"
                          ? "bg-info text-dark"
                          : "bg-success"
                      }`}
                    >
                      {file.phase === false
                        ? "Application Phase"
                        : file.phase === true
                        ? "Project Execution"
                        : file.phase || "Unknown Phase"}
                    </span>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Sekcja uploadu plików */}
      <div className="task-documents-section">
        <h2>Upload Budget Document</h2>
        {message && (
          <Alert variant={message.includes("Success") ? "success" : "danger"}>
            {message}
          </Alert>
        )}

        <Form onSubmit={handleUpload} className="mt-3">
          <Form.Group className="mb-3">
            <Form.Label>Select File</Form.Label>
            <Form.Control type="file" onChange={handleFileChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Select Category</Form.Label>
            <Form.Control
              as="select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">-- Select Category --</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {formatCategory(cat)}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Select Expense</Form.Label>
            <Form.Control
              as="select"
              value={expenseId}
              onChange={(e) => setExpenseId(e.target.value)}
              required
            >
              <option value="">-- Select Expense --</option>
              {expenses.map((expense) => (
                <option key={expense.id} value={expense.id}>
                  {expense.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description (Optional)</Form.Label>
            <Form.Control
              as="textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>

          <Button type="submit" variant="primary">
            Upload File
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default BudgetDocuments;
