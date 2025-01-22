const jwt = require("jsonwebtoken");

module.exports = {
  issueToken,
  verifyToken,
  check_auth_token,
};

// 簽發 Token
function issueToken(payload, options = { expiresIn: process.env.JWT_EXPIRES_IN }) {
  return jwt.sign(payload, process.env.JWT_SECRET, options);
}

// 驗證 Token
function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error("無效或過期的token");
  }
}

// 驗證中間件
function check_auth_token(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "缺少token" });
  }

  try {
    const user = verifyToken(token);
    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({ message: "無效或過期的token" });
  }
}
