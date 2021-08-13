const User = require("../../model/user");
const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  let token = req.get("Authorization");
  try {
    if (token) {
      token = token.split(" ");
      if (token.length > 0 && token[0].includes("Bearer")) {
        const jwtVerify = jwt.verify(token[1], process.env.JWT_SECRET);
        req.token = jwtVerify;
        req.user = await User.findOne({ _id: jwtVerify.id });
      }
    }
    next();
  } catch (error) {
    next();
  }
};

module.exports = { verifyToken };
