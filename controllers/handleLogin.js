const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../model/user");
const jwt = require("jsonwebtoken");
//can only log in if verified

router.post("/", async (req, res, next) => {
  const body = req.body;
  if (!body || !body.username || !body.password) {
    return res.send({ message: "Fill in the fields" }).sendStatus(406);
  }
  const loggingUser = await User.findOne({ username: body.username });
  if (!loggingUser) {
    return res.send({ message: "User does not exist" }.sendStatus(404));
  }

  const comparePW = await bcrypt.compare(
    body.password,
    loggingUser.passwordHash
  );
  if (!comparePW) {
    return res.send({ message: "Wrong password" }).sendStatus(406);
  }
  if (!loggingUser.verified) {
    return res.send({ message: "Please verify your account" }).sendStatus(403);
  }
  const token = await jwt.sign(
    { username: body.username, id: loggingUser.id },
    process.env.JWT_SECRET
  );

  return res.send({ message: "Succesfully logged in", token }).sendStatus(202);
});
module.exports = router;
