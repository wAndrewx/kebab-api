require("dotenv");
const router = require("express").Router();
const User = require("../model/user");
const bcryptjs = require("bcryptjs");
const cryptoJS = require("crypto-js");
const utils = require("../utils/nodemail");

router.post("/", async (req, res, next) => {
  const body = req.body; // get info and create a new user in the db
  //check in database for email and username

  try {
    const reqName = await User.find({ username: body.username });
    if (Object.keys(body).length === 0) {
      return res.status(400).send({ message: "Fill in the fields" });
    }

    if (reqName.length !== 0) {
      return res
        .status(406)
        .send({ message: `Please choose a different user name` });
    }

    if (body.password.length < 7) {
      return res.status(406).send({ message: "Password is too short" });
    }

    const pwHash = await bcryptjs.hash(body.password, 10);
    const genVerifyHash = cryptoJS.AES.encrypt(
      //handle email regex front end
      body.email,
      process.env.VERIFY_SECRET
    )
      .toString()
      .replaceAll("/", "-");

    const reqUser = {
      username: body.username, //req.body.username
      email: body.email,
      passwordHash: pwHash, //hash
      verifyHash: genVerifyHash, //hash
    };

    const newUser = new User(reqUser);
    await newUser.save();
    //send email to verify
    utils.emailVerifyHash(genVerifyHash, body.email);
    return res
      .send({ message: "Account created, verify your email" })
      .status(201);
  } catch (err) {
    if (err.name.includes("MongoError")) {
      return res.status(406).send({ message: "Use a different email" });
    }
    return res.send({ message: err });
  }
});

router.get("/verify/:hash", async (req, res, next) => {
  const paramHash = req.params.hash.replaceAll("-", "/");
  const decrypt = cryptoJS.AES.decrypt(paramHash, process.env.SECRET);
  const toStringHash = decrypt.toString(cryptoJS.enc.Utf8);
  try {
    await User.findOneAndUpdate({ email: toStringHash }, { verified: true });
    res.status(204);
  } catch (error) {
    res.status(400);
  }
});

module.exports = router;
