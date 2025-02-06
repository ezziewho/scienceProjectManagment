import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../hooks/AuthContext"; // Pobieranie danych użytkownika

const TaskDocuments = () => {
  const [file, setFile] = useState(null);
  const [tasks, setTasks] = useState([]); // Lista zadań do wyboru
  const [selectedTaskId, setSelectedTaskId] = useState(""); // ID wybranego zadania do uploadu
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [selectedTaskForFiles, setSelectedTaskForFiles] = useState(""); // ID wybranego zadania do pobrania plików
  const [taskFiles, setTaskFiles] = useState([]); // Lista plików powiązanych z zadaniem

  const { currentUser } = useAuth();

  useEffect(() => {
    // Pobranie listy zadań użytkownika
    const fetchTasks = async () => {
      try {
        const response = await axios.get("http://localhost:8081/kanban/tasks");
        setTasks(response.data);
      } catch (error) {
        console.error("Błąd pobierania zadań:", error);
      }
    };

    if (currentUser) {
      fetchTasks();
    }
  }, [currentUser]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file || !selectedTaskId) {
      setMessage("📂 Wybierz plik i zadanie.");
      return;
    }

    if (!currentUser) {
      setMessage("❌ Błąd: użytkownik niezalogowany.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("task_id", selectedTaskId); // Przekazujemy ID zadania
    formData.append("user_id", currentUser.id);
    formData.append("description", description);

    try {
      const response = await axios.post(
        "http://localhost:8081/document/upload/task-file",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage(`✅ Sukces! Plik przesłany: 
        ➡️ <a href="${response.data.file.fileUrl}" target="_blank">Kliknij, aby zobaczyć plik</a>`);

      // Resetowanie pól po wysłaniu
      setFile(null);
      setSelectedTaskId("");
      setDescription("");
    } catch (error) {
      console.error("Błąd przesyłania pliku:", error);
      setMessage(
        error.response?.data?.error ||
          "❌ Błąd przesyłania pliku. Spróbuj ponownie."
      );
    }
  };

  const handleGetFiles = async () => {
    if (!selectedTaskForFiles) {
      setMessage("📌 Wybierz zadanie, aby pobrać pliki.");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:8081/document/files/task/${selectedTaskForFiles}`
      );
      setTaskFiles(Array.isArray(response.data) ? response.data : []); // Zapewniamy, że to tablica
    } catch (error) {
      console.error("Błąd pobierania plików:", error);
      setMessage("❌ Błąd pobierania plików zadania.");
      setTaskFiles([]); // Ustawienie pustej tablicy w przypadku błędu
    }
  };

  const handleDownloadFile = async (fileId, fileName) => {
    try {
      const response = await axios.get(
        `http://localhost:8081/document/download/task/${fileId}`,
        { responseType: "blob" } // Pobieramy jako binarny plik
      );

      // Tworzymy URL do pobrania pliku
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName); // Ustawiamy nazwę pliku
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
        `http://localhost:8081/document/delete/task/${fileId}`
      );
      setTaskFiles(taskFiles.filter((file) => file.id !== fileId));
      setMessage("🗑️ Plik został usunięty.");
    } catch (error) {
      console.error("Błąd usuwania pliku:", error);
      setMessage("❌ Nie udało się usunąć pliku.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>📄 Prześlij dokument zadania</h2>
      {message && (
        <div
          className="alert alert-info"
          dangerouslySetInnerHTML={{ __html: message }}
        ></div>
      )}

      <form onSubmit={handleUpload} className="mt-3">
        <div className="mb-3">
          <label className="form-label">📂 Wybierz plik</label>
          <input
            type="file"
            className="form-control"
            onChange={handleFileChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">📌 Wybierz zadanie</label>
          <select
            className="form-control"
            value={selectedTaskId}
            onChange={(e) => setSelectedTaskId(e.target.value)}
            required
          >
            <option value="">-- Wybierz zadanie --</option>
            {tasks.map((task) => (
              <option key={task.id} value={task.id}>
                {task.title}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">✏️ Opis (opcjonalnie)</label>
          <textarea
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary">
          🚀 Wyślij plik
        </button>
      </form>

      <hr />

      <h3>📌 Wybierz zadanie, aby zobaczyć pliki</h3>
      <div className="mb-3">
        <select
          className="form-control"
          value={selectedTaskForFiles}
          onChange={(e) => setSelectedTaskForFiles(e.target.value)}
        >
          <option value="">-- Wybierz zadanie --</option>
          {tasks.map((task) => (
            <option key={task.id} value={task.id}>
              {task.title}
            </option>
          ))}
        </select>
      </div>

      <button className="btn btn-secondary" onClick={handleGetFiles}>
        📂 Pobierz pliki
      </button>

      <hr />

      <h3>📁 Pliki powiązane z zadaniem</h3>
      <ul className="list-group mt-3">
        {taskFiles.map((file) => (
          <li key={file.id} className="list-group-item">
            <strong>{file.file_name}</strong> <br />
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
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskDocuments;
