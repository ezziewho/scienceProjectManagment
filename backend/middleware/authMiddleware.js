export const isAdmin = (req, res, next) => {
  if (!req.session || !req.session.role) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized. Please log in." });
  }

  if (req.session.role !== "manager") {
    // Assuming "manager" is the role for admins
    return res
      .status(403)
      .json({ success: false, message: "Access denied. Admins only." });
  }

  next(); // User is an admin, proceed to the next middleware/route
};

export const isAuthenticated = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized. Please log in." });
  }
  next(); // User is authenticated, proceed to the next middleware/route
};
