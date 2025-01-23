export const checkAuth = (req, res) => {
    //console.log("CHUJEK Session data:", req.session); // Debug session data
    if (req.session.userId) {
        // User is logged in, return role and userId
        return res.json({
            valid: true,
            role: req.session.role || "visitor", // Default role to "visitor" if undefined
            userId: req.session.userId
        });
    } else {
        // User is not logged in
        return res.json({ valid: false });
    }
};
