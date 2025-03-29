import { useState, useEffect } from "react";
import { fetchTasks, updateTask, createTask } from "../services/taskService";

// Hook customowy do zarządzania zadaniami
export const useTasks = (initialFilters = {}) => {
  // Stan dla listy zadań
  const [tasks, setTasks] = useState([]);
  // Stan dla wskaźnika ładowania
  const [loading, setLoading] = useState(true);
  // Stan dla błędów
  const [error, setError] = useState(null);
  // Stan dla przełącznika wyświetlania wszystkich zadań
  const [showAllTasks, setShowAllTasks] = useState(false);
  // Stan dla filtrów
  const [filters, setFilters] = useState(initialFilters);

  // Efekt uboczny, który ładuje zadania przy zmianie filtrów lub przełącznika wyświetlania wszystkich zadań
  useEffect(() => {
    const loadTasks = async () => {
      setLoading(true); // Ustawienie wskaźnika ładowania na true
      setError(null); // Resetowanie błędów
      try {
        // Pobieranie zadań z serwera z użyciem filtrów i przełącznika wyświetlania wszystkich zadań
        const response = await fetchTasks(filters, showAllTasks); // Zmiana sposobu przekazywania argumentów
        console.log("Response from fetchTasks:", response); // Debugging log
        if (!response || !response.data) {
          throw new Error("Invalid response received from fetchTasks");
        }

        // Zakładając, że response.data.tasks jest tablicą
        if (!Array.isArray(response.data)) {
          // Dodanie sprawdzenia struktury odpowiedzi
          throw new Error("Expected an array but got something else");
        }

        setTasks(response.data); // Ustawienie pobranych zadań w stanie
      } catch (err) {
        setError("Error fetching tasks."); // Ustawienie błędu w przypadku niepowodzenia
        console.error(err); // Logowanie błędu w konsoli
      } finally {
        setLoading(false); // Ustawienie wskaźnika ładowania na false
      }
    };

    loadTasks(); // Wywołanie funkcji ładowania zadań
  }, [filters, showAllTasks]); // Efekt uboczny zależny od filtrów i przełącznika wyświetlania wszystkich zadań

  // Funkcja do dodawania nowego zadania
  const addTask = async (task) => {
    try {
      const response = await createTask(task); // Tworzenie nowego zadania na serwerze
      setTasks((prev) => [...prev, response.data]); // Dodanie nowego zadania do stanu
    } catch (err) {
      console.error("Error adding task:", err); // Logowanie błędu w przypadku niepowodzenia
    }
  };

  // Funkcja do aktualizacji istniejącego zadania w stanie
  const updateTaskInState = async (updatedTask) => {
    try {
      await updateTask(updatedTask); // Aktualizacja zadania na serwerze
      setTasks((prev) =>
        prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      ); // Aktualizacja zadania w stanie
    } catch (err) {
      console.error("Error updating task:", err); // Logowanie błędu w przypadku niepowodzenia
    }
  };

  // Zwracanie stanu i funkcji do zarządzania zadaniami
  return {
    tasks, // Lista zadań
    addTask, // Funkcja do dodawania zadania
    updateTask: updateTaskInState, // Funkcja do aktualizacji zadania
    loading, // Wskaźnik ładowania
    error, // Błędy
    showAllTasks, // Przełącznik wyświetlania wszystkich zadań
    setShowAllTasks, // Funkcja do ustawiania przełącznika wyświetlania wszystkich zadań
  };
};
