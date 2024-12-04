/*import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import db from "./db.js"; // Import the db module
import session from "express-session";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

const salt = 10;
const app = express();

app.use(cors({
    origin: ['http://localhost:3000'],
    methods: ['POST', 'GET'],
    credentials: true // Correct casing for credentials
}));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(session({
    secret: `secret`,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Set true in production with HTTPS
        httpOnly: true, // Prevent access via client-side JavaScript
        maxAge: 1000 * 60 * 60 * 24, // 1 day
    }
}));

// Check authentication status
app.get("/checkauth", (req, res) => {
    if (req.session.role) {
        return res.json({ valid: true, role: req.session.role });
    } else {
        return res.json({ valid: false });
    }
});

// User signup
app.post("/signup", (req, res) => {
    const sql = "INSERT INTO login (`name`, `email`, `password`) VALUES (?)";
    const password = req.body.password;

    bcrypt.hash(password.toString(), salt, (err, hash) => {
        if (err) {
            console.error("Bcrypt error:", err);
            return res.status(500).json("Error hashing password");
        }
        const values = [req.body.name, req.body.email, hash];
        db.query(sql, [values], (err, data) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json("Error inserting user");
            }
            return res.json({ success: true });
        });
    });
});

// User login
app.post("/login", (req, res) => {
    const sql = "SELECT * FROM login WHERE `email` = ?";
    db.query(sql, [req.body.email], (err, data) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json("Error querying user");
        }
        if (data.length > 0) {
            bcrypt.compare(req.body.password.toString(), data[0].password, (err, response) => {
                if (err) {
                    console.error("Bcrypt comparison error:", err);
                    return res.status(500).json("Error comparing passwords");
                }
                if (response) {
                    req.session.role = data[0].role; // Save username in session
                    console.log("Logged in user:", req.session.username);
                    return res.json({ Login: true });
                }
                return res.status(401).json({ Login: false }); // Incorrect password
            });
        } else {
            return res.status(404).json("User not found"); // User not found
        }
    });
});

app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error("Error destroying session:", err);
            return res.status(500).json({ success: false, message: "Failed to log out" });
        }
        res.clearCookie('connect.sid'); // Clear the session cookie
        return res.json({ success: true, message: "Logged out successfully" });
    });
});

app.listen(8081, () => {
    console.log("Listening on port 8081");
});*/
import express from "express";
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import sessionConfig from "./config/session.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import kanbanRoutes from "./routes/kanban.js";

const app = express();

// Middleware setup
app.use(cors({
    origin: ['http://localhost:3000'],
    methods: ['POST', 'GET'],
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(session(sessionConfig));

// Routes
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/kanban", kanbanRoutes);

console.log("Auth routes registered under /auth");

// Start server
app.listen(8081, () => {
    console.log("Listening on port 8081");
});
