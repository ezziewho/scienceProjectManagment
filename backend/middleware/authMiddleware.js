export const isAdmin = (req, res, next) => {
    if (req.session.role === "admin") {
        return next(); // User is an admin, proceed to the next middleware/route
    } else {
        return res.status(403).json({ success: false, message: "Access denied. Admins only." });
    }
};
