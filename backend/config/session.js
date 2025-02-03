export default {
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Set true in production with HTTPS
        httpOnly: true,
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
};
