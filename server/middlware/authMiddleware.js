const jwt = require("jsonwebtoken");

const authMiddleware = (premiumOnly = false) => {
  return (req, res, next) => {
    const authHeader = req.headers['authorization']; // <-- error occurs if req undefined
    if (!authHeader)
      return res.status(401).json({ message: "No token provided" });

    const token = authHeader.split(" ")[1]; // Bearer <token>
    if (!token)
      return res.status(401).json({ message: "Token missing or malformed" });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.status(401).json({ message: "Invalid token" });

      req.user = decoded; // attach decoded payload
      if (premiumOnly && !decoded.isPremium) 
        return res.status(403).json({ message: "Premium access required" });

      next();
    });
  };
};

module.exports = authMiddleware;
