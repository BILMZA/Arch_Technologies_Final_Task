// main purpose of middleware is to handle the logic for the application
//middleware to protect routes and ensure that only authenticated users can access certain endpoints
// in easy terms, this file will define a middleware function 
// that checks if a user is authenticated before allowing them to access certain routes

const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Not authorized, token missing",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.userId;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Not authorized, invalid token",
    });
  }
};

module.exports = protect;