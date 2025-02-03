import Grant from "../models/Grant.js";

export const getGrant = async (req, res) => {
    try {
        const grants = await Grant.findAll(); // Pobiera wszystkie dane z tabeli `grant`
        console.log(grants);
        res.status(200).json(grants); // Zwraca dane w formacie JSON
    } catch (error) {
        console.error("Error fetching grants:", error);
        res.status(500).json({ error: "Failed to fetch grants" });
    }
};
