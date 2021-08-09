const router = require("express").Router();
const User = require("../model/user");
const Kebab = require("../model/kebab");
router.get("/feed", (req, res, next) => {});

router.get("/:id", (req, res) => {});

router.delete("/:id",  async(req, res) => {
    const find = await User.find({username:user})
});

router.post("/", (req, res) => {});
module.exports = router;
