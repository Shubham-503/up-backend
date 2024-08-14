const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // console.log("request header>>: ", JSON.stringify(req.header));

  const token = req.header("Authorization").replace("Bearer ", "");
  if (!token)
    return res.status(401).json({ error: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, "secretkey");
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: "Token is not valid" });
  }
};
