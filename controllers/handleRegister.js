require("dotenv");
const router = require("express").Router();
const User = require("../model/user");
const bcryptjs = require("bcryptjs");
const cryptoJS = require("crypto-js");
const utils = require("../utils/nodemail");

router.post("/", async (req, res, next) => {
  const body = req.body; // get info and create a new user in the db
  //check in database for email and username
  if (!body || !body.username || !body.password || !body.email) {
    return res.status(406).send({ message: "Fill in the fields" });
  }

  if (body.password.length < 7) {
    return res.status(406).send({ message: "Password is too short" });
  }
  try {
    const reqName = await User.find({ username: body.username });

    if (reqName.length !== 0) {
      return res
        .status(406)
        .send({ message: `Please choose a different user name` });
    }

    const pwHash = await bcryptjs.hash(body.password, 10);
    const genVerifyHash = cryptoJS.AES.encrypt(
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
      .status(201)
      .send({ message: "Account created, verify your email" });
  } catch (err) {
    if (err.name.includes("MongoError")) {
      return res.status(406).send({ message: "Use a different email" });
    }
    return res.send({ message: err });
  }
});

router.get("/verify/:hash", async (req, res, next) => {
  const paramHash = req.params.hash.replaceAll("-", "/");
  const decrypt = cryptoJS.AES.decrypt(paramHash, process.env.VERIFY_SECRET);
  const toStringHash = decrypt.toString(cryptoJS.enc.Utf8);

  try {
    let find = await User.findOneAndUpdate(
      { email: toStringHash },
      { verified: true }
    );
    if (!find) {
      res.send("User does not exist").status(204);
    } else {
      res.send("You are now verified").status(204);
    }
  } catch (error) {
    res.status(400).send("Not verified");
  }
});

module.exports = router;
