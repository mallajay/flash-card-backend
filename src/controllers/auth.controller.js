import jwt from "jsonwebtoken";

export const AuthController = {
  login: async (req, res) => {
    const { email } = req.body;

    // In real-world: check user existence + password
    const user = { id: 1, email };

    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token });
  },
};
