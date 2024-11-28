export const checkAuth = (req, res) => {
    if (req.session.role) {
        return res.json({ valid: true, role: req.session.role });
    } else {
        return res.json({ valid: false });
    }
};
