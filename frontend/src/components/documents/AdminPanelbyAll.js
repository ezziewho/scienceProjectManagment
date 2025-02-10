import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Container, Alert, Form } from "react-bootstrap";
import { IconDownload, IconTrash, IconEdit } from "@tabler/icons-react";
import "../../css/TaskTable.css"; // Styl tabeli

const AdminPanelByAll = () => {
  const [files, setFiles] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [userNames, setUserNames] = useState({});

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8081/document/files/admin"
      );
      setFiles(response.data);
      setFilteredFiles(response.data);
    } catch (error) {
      console.error("Error fetching files:", error);
      setMessage("Error fetching files.");
    }
  };

  const handleDelete = async (fileId, file_table_category) => {
    try {
      await axios.delete(
        `http://localhost:8081/document/delete/${file_table_category}/${fileId}`
      );
      setFiles(files.filter((file) => file.id !== fileId));
      setFilteredFiles(filteredFiles.filter((file) => file.id !== fileId));
      setMessage("File has been deleted.");
    } catch (error) {
      console.error("Error deleting file:", error);
      setMessage("Error: Unable to delete file.");
    }
  };

  const handleDownload = async (fileId, file_table_category) => {
    try {
      await axios.post(
        `http://localhost:8081/document/download/admin/${file_table_category}/${fileId}`
      );
      setMessage("File has been downloaded.");
    } catch (error) {
      console.error("Error downloading file:", error);
      setMessage("Error: Unable to download file.");
    }
  };

  const fetchUserNames = async (files) => {
    const uniqueUserIds = [
      ...new Set(files.map((file) => file.uploaded_by).filter(Boolean)),
    ];

    const userResponses = await Promise.all(
      uniqueUserIds.map((id) =>
        axios
          .get(`http://localhost:8081/user/profile/${id}`, {
            withCredentials: true,
          })
          .then((res) => ({ id, name: res.data.name }))
          .catch(() => ({ id, name: "Unknown User" }))
      )
    );

    const userMap = userResponses.reduce((acc, user) => {
      acc[user.id] = user.name;
      return acc;
    }, {});

    setUserNames(userMap);
  };
  useEffect(() => {
    if (files.length > 0) {
      fetchUserNames(files);
    }
  }, [files]);

  useEffect(() => {
    let filtered = files.filter((file) =>
      file.file_name.toLowerCase().includes(search.toLowerCase())
    );

    if (filterCategory) {
      filtered = filtered.filter(
        (file) => file.file_table_category === filterCategory
      );
    }
    setFilteredFiles(filtered);
  }, [search, filterCategory, files]);

  return (
    <Container>
      <h3>File Management Panel</h3>
      {message && <Alert variant="info">{message}</Alert>}

      <Form className="mb-3">
        <Form.Control
          type="text"
          placeholder="Search file..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Form.Select
          className="mt-2"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="">---Select Category---</option>
          <option value="task">Task Files</option>
          <option value="team">Team Files</option>
          <option value="expense">Budget Files</option>
        </Form.Select>
      </Form>

      <Table
        className="task-table"
        bordered={false}
        hover
        style={{
          borderCollapse: "separate",
          borderSpacing: "0",
          borderRadius: "10px",
          overflow: "hidden",
          width: "100%", // Pełna szerokość
        }}
      >
        <thead>
          <tr>
            <th
              style={{
                textAlign: "left",
                paddingLeft: "10px",
                verticalAlign: "middle",
              }}
            >
              User
            </th>
            <th
              style={{
                textAlign: "left",
                paddingLeft: "10px",
                verticalAlign: "middle",
              }}
            >
              File Name
            </th>
            <th style={{ textAlign: "center", verticalAlign: "middle" }}>
              Category
            </th>
            <th
              style={{
                textAlign: "left",
                paddingLeft: "10px",
                verticalAlign: "middle",
              }}
            >
              Description
            </th>
            <th
              style={{
                textAlign: "center",
                verticalAlign: "middle",
                width: "200px",
              }}
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredFiles.map((file) => (
            <tr key={file.id}>
              <td
                style={{
                  textAlign: "left",
                  paddingLeft: "10px",
                  verticalAlign: "middle",
                }}
              >
                {userNames[file.uploaded_by] || "Unknown User"}
              </td>
              <td
                style={{
                  textAlign: "left",
                  paddingLeft: "10px",
                  verticalAlign: "middle",
                }}
              >
                {file.file_name}
              </td>
              <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                {file.file_table_category}
              </td>
              <td
                style={{
                  textAlign: "left",
                  paddingLeft: "10px",
                  verticalAlign: "middle",
                }}
              >
                {file.description}
              </td>

              <td
                style={{
                  textAlign: "center",
                  verticalAlign: "middle",
                  width: "200px",
                }}
              >
                <div
                  className="file-actions"
                  style={{
                    display: "flex",
                    gap: "5px",
                    justifyContent: "flex-end",
                  }}
                >
                  <Button
                    variant="success"
                    className="custom-button"
                    onClick={() =>
                      handleDownload(file.id, file.file_table_category)
                    }
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "5px",
                      width: "40px",
                      height: "40px",
                      padding: "5px 10px",
                      backgroundColor: "RGB(40, 167, 69)",
                    }}
                  >
                    <IconDownload size={16} />
                  </Button>

                  <Button
                    className="btn-sm btn-primary"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "5px",
                      width: "40px",
                      height: "40px",
                      padding: "5px 10px",
                    }}
                  >
                    <IconEdit size={16} />
                  </Button>

                  <Button
                    className="custom-button"
                    variant="danger"
                    onClick={() =>
                      handleDelete(file.id, file.file_table_category)
                    }
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "5px",
                      width: "40px",
                      height: "40px",
                      padding: "5px 10px",
                      backgroundColor: "rgb(220, 53, 69)",
                    }}
                  >
                    <IconTrash size={16} />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default AdminPanelByAll;
