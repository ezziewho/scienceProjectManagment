import React, { useState } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const EquipmentAndSoftware = () => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: 1,
    unit_price: "",
    total_cost: "0.00",
    purchase_date: "",
    supplier: "",
    file: null,
    file_description: "",
  });

  // Obsługa zmiany w formularzu
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };

      // Automatyczne przeliczanie total_cost
      if (name === "quantity" || name === "unit_price") {
        const quantity = Number(updatedData.quantity) || 0;
        const unitPrice = Number(updatedData.unit_price) || 0;
        updatedData.total_cost = (quantity * unitPrice).toFixed(2);
      }

      return updatedData;
    });
  };

  // Obsługa zmiany pliku
  const handleFileChange = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      console.error("❌ Nie wybrano pliku!");
      return;
    }

    const file = e.target.files[0];
    console.log("📂 Wybrany plik:", file);
    console.log("📂 Typ pliku:", file.type);
    console.log("📂 Nazwa pliku:", file.name);
    console.log("📂 Rozmiar pliku:", file.size);

    setFormData((prevData) => ({ ...prevData, file }));
  };

  // Obsługa zapisu - tylko wyświetlenie w konsoli

  const handleSave = () => {
    console.log("📋 Zapisuję formData:", formData);

    // Tworzymy kopię bez pliku
    const { file, ...formDataWithoutFile } = formData;

    // Zapisujemy dane tekstowe w `localStorage`
    localStorage.setItem("draftExpense", JSON.stringify(formDataWithoutFile));

    // Plik zapisujemy w `sessionStorage`
    if (file) {
      sessionStorage.setItem(
        "expenseFile",
        JSON.stringify({
          name: file.name,
          type: file.type,
          lastModified: file.lastModified,
        })
      );
    }
  };

  return (
    <div>
      <h4>Equipment and Software</h4>

      <Form>
        {/* 📌 Name */}
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        {/* 📌 Category */}
        <Form.Group className="mb-3">
          <Form.Label>Category</Form.Label>
          <Form.Select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
          >
            <option value="">-- Select Category --</option>
            <option value="scientific_apparatus">Scientific Apparatus</option>
            <option value="measurement_devices">Measurement Devices</option>
          </Form.Select>
        </Form.Group>

        {/* 📌 Quantity & Unit Price */}
        <Row>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                min="1"
                required
              />
            </Form.Group>
          </Col>

          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Unit Price ($)</Form.Label>
              <Form.Control
                type="number"
                name="unit_price"
                value={formData.unit_price}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                required
              />
            </Form.Group>
          </Col>
        </Row>

        {/* 📌 Total Cost (Read-only) */}
        <Form.Group className="mb-3">
          <Form.Label>Total Cost ($)</Form.Label>
          <Form.Control
            type="text"
            name="total_cost"
            value={formData.total_cost}
            readOnly
          />
        </Form.Group>

        {/* 📌 Purchase Date */}
        <Form.Group className="mb-3">
          <Form.Label>Purchase Date</Form.Label>
          <Form.Control
            type="date"
            name="purchase_date"
            value={formData.purchase_date}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        {/* 📌 Supplier */}
        <Form.Group className="mb-3">
          <Form.Label>Supplier</Form.Label>
          <Form.Control
            type="text"
            name="supplier"
            value={formData.supplier}
            onChange={handleInputChange}
          />
        </Form.Group>

        {/* 📌 Upload File */}
        <Form.Group className="mb-3">
          <Form.Label>Upload File</Form.Label>
          <Form.Control type="file" name="file" onChange={handleFileChange} />
        </Form.Group>

        {/* 📌 File Description */}
        <Form.Group className="mb-3">
          <Form.Label>File Description</Form.Label>
          <Form.Control
            type="text"
            name="file_description"
            value={formData.file_description}
            onChange={handleInputChange}
          />
        </Form.Group>

        {/* 📌 Save Button */}
        <Button variant="primary" onClick={handleSave}>
          Save
        </Button>
      </Form>
    </div>
  );
};

export default EquipmentAndSoftware;
