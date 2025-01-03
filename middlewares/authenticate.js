const jwt = require("jsonwebtoken");
const TOKEN_COOKIE_NAME = "auth_token";
const SECRET_KEY = process.env.SECRET_KEY || "user";

const authenticateToken = (req, res, next) => {
  const token = req.cookies[TOKEN_COOKIE_NAME];
  if (!token) {
    return res.redirect("/user/login");
    // return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const user = jwt.verify(token, SECRET_KEY);
    req.user = user;
    next();
  } catch (error) {
    res.status(403).json({ message: "Forbidden" });
  }
};

module.exports = authenticateToken;
