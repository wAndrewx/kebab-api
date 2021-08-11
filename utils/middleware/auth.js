const User = require("../../model/user");
const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  const token = req.get("Authorization").split(" ");
  // console.log(token);
  if (token.length > 0 && token[0].includes("Bearer")) {
    const jwtVerify = jwt.verify(token[1], process.env.JWT_SECRET);
    req.token = jwtVerify;
    req.user = await User.find({ _id: jwtVerify.id });
  } 

  next();
};

module.exports = { verifyToken };
