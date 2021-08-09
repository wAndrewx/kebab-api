require("dotenv");
const router = require("express").Router();
const User = require("../model/user");
const bcrypt = require("bcrypt");
const cryptoJS = require("crypto-js");
const utils = require("../utils/nodemail");

router.post("/", async (req, res, next) => {
  const body = req.body; // get info and create a new user in the db
  //check in database for email and username

  try {
    const reqName = await User.find({ username: body.username });
    if (Object.keys(body).length === 0) {
      return res.send({ message: "Fill in the fields" }).sendStatus(400);
    }

    if (reqName.length !== 0) {
      return res
        .status(406)
        .send({ message: `Please choose a different user name` });
    }

    if (body.password.length < 7) {
      return res.send({ message: "Password is too short" }).sendStatus(406);
    }

    const pwHash = await bcrypt.hash(body.password, 10);
    const genVerifyHash = cryptoJS.AES.encrypt(
      //handle email regex front end
      body.email,
      process.env.SECRET
    )
      .toString()
      .replaceAll("/", "-");
    console.log(genVerifyHash);

    const reqUser = {
      username: body.username, //req.body.username
      email: body.email,
      passwordHash: pwHash, //bcrypt
      verifyHash: genVerifyHash,
    };

    const newUser = new User(reqUser);
    await newUser.save();
    //send email to verify
    // utils.emailVerifyHash(genVerifyHash, body.email);
    return res
      .send({ message: "Account created, verify your email" })
      .status(201);
  } catch (err) {
    if (err.name.includes("MongoError")) {
      return res.send({ message: "Use a different email" });
    }
    return res.send(err);
  }
});

router.get("/verify/:hash", async (req, res, next) => {
  const paramHash = req.params.hash.replaceAll("-", "/");
  const decrypt = cryptoJS.AES.decrypt(paramHash, process.env.SECRET);
  const toStringHash = decrypt.toString(cryptoJS.enc.Utf8);
  console.log("DECRYPT:", toStringHash);
  try {
    await User.findOneAndUpdate({ email: toStringHash }, { verified: true });
    res.sendStatus(204);
  } catch (error) {
    res.sendStatus(400);
  }
  //then find email and set verified to true;
});

module.exports = router;
