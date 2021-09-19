const router = require("express").Router();
const User = require("../model/user");
const cryptoJS = require("crypto-js");

router.post("/:hash", async (req, res, next) => {
  const paramHash = req.params.hash.split("-").join("/");

  const decrypt = cryptoJS.AES.decrypt(paramHash, process.env.VERIFY_SECRET);
  const toStringHash = decrypt.toString(cryptoJS.enc.Utf8);
  try {
    let find = await User.findOneAndUpdate(
      { email: toStringHash },
      { verified: true }
    );

    if (!find) {
      res.send("User does not exist");
    } else {
      res.send("You are now verified");
    }
  } catch (error) {
    res.status(400).send("Not verified");
  }
});

module.exports = router;
