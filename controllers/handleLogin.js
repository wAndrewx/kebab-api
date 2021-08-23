const router = require("express").Router();
const bcryptjs = require("bcryptjs");
const User = require("../model/user");
const jwt = require("jsonwebtoken");
//can only log in if verified

router.post("/", async (req, res, next) => {
  const body = req.body;
  if (!body || !body.username || !body.password) {
    return res.status(406).send({ message: "Fill in the fields" });
  }
  const loggingUser = await User.findOne({ username: body.username });
  if (!loggingUser) {
    return res.status(400).send({ message: "User does not exist" });
  }

  const comparePW = await bcryptjs.compare(
    body.password,
    loggingUser.passwordHash
  );
  if (!comparePW) {
    return res.status(406).send({ message: "Wrong password" });
  }
  if (!loggingUser.verified) {
    return res.status(403).send({ message: "Please verify your account" });
  }

  if (comparePW && loggingUser.verified) {
    const token = await jwt.sign(
      { username: body.username, id: loggingUser.id },
      process.env.JWT_SECRET
    );

    return res.status(202).send({ message: "Succesfully logged in", token });
  }
});
module.exports = router;
