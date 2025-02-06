import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../hooks/AuthContext"; // Pobieranie danych użytkownika

const TeamDocuments = () => {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [teamFiles, setTeamFiles] = useState([]); // Lista plików powiązanych z użytkownikiem

  const { currentUser } = useAuth();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage("📂 Wybierz plik, aby przesłać.");
      return;
    }

    if (!currentUser) {
      setMessage("❌ Błąd: użytkownik niezalogowany.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_id", currentUser.id); // Użytkownik przesyłający plik
    formData.append("description", description);

    try {
      const response = await axios.post(
        "http://localhost:8081/document/upload/team-file",
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
      setDescription("");
    } catch (error) {
      console.error("Błąd przesyłania pliku:", error);
      setMessage(
        error.response?.data?.error ||
          "❌ Błąd przesyłania pliku. Spróbuj ponownie."
      );
    }
  };

  const handleGetTeam = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8081/document/files/team/${currentUser.id}`
      );
      setTeamFiles(Array.isArray(response.data) ? response.data : []); // Zapewniamy, że to tablica
    } catch (error) {
      console.error("Błąd pobierania plików:", error);
      setMessage("❌ Błąd pobierania plików.");
      setTeamFiles([]); // Ustawienie pustej tablicy w przypadku błędu
    }
  };

  const handleDownloadFile = async (fileId, fileName) => {
    try {
      const response = await axios.get(
        `http://localhost:8081/document/download/team/${fileId}`,
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
        `http://localhost:8081/document/delete/team/${fileId}`
      );
      setTeamFiles(teamFiles.filter((file) => file.id !== fileId));
      setMessage("🗑️ Plik został usunięty.");
    } catch (error) {
      console.error("Błąd usuwania pliku:", error);
      setMessage("❌ Nie udało się usunąć pliku.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>📄 Prześlij dokument zespołu</h2>
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

      <button className="btn btn-secondary" onClick={handleGetTeam}>
        📂 Pobierz pliki
      </button>

      <hr />

      <h3>📁 Pliki powiązane z użytkownikiem</h3>
      {Array.isArray(teamFiles) && teamFiles.length === 0 ? (
        <p>Brak plików dla wybranego użytkownika.</p>
      ) : (
        <ul className="list-group mt-3">
          {Array.isArray(teamFiles) &&
            teamFiles.map((file) => (
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
            ))}
        </ul>
      )}
    </div>
  );
};

export default TeamDocuments;
