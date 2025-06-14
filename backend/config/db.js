import mysql from 'mysql';

// Define database configuration
const dbConfig = {
    host: "localhost",
    user: "root",
    password: "",
    database: "projectsmanager"
};

let connection;

function handleDisconnect() {
    connection = mysql.createConnection(dbConfig); // Create a new connection

    connection.connect(err => {
        if (err) {
            console.error("Error connecting to the database:", err);
            setTimeout(handleDisconnect, 2000); // Retry after 2 seconds
        } else {
            console.log("Database connected successfully");
        }
    });

    connection.on("error", err => {
        console.error("Database error:", err);
        if (err.code === "PROTOCOL_CONNECTION_LOST") {
            handleDisconnect(); // Reconnect on connection loss
        } else {
            throw err; // Throw other errors
        }
    });
}

handleDisconnect();

export default connection;

