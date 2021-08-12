const router = require("express").Router();
const User = require("../model/user");
const Kebab = require("../model/kebab");

const redirectLink = "http://localhost:3000/";

router.get("/feed", async (req, res, next) => {
  if (!req.user) {
    res.redirect(redirectLink);
  }
  const allFeed = await Kebab.find({}).populate("user", {
    username: 1,
  }); // be sure to .sort the objects by date,front end
  res.json(allFeed);
});

router.post("/", async (req, res) => {
  // fix so that user that tweeted stores the twwwt in doc
  if (!req.user) {
    res.redirect(redirectLink);
  }
  const content = { content: req.body.content, user: req.token.id };
  const keebab = new Kebab(content);

  const updateUserKebab = await User.findById(req.token.id);
  updateUserKebab.kebab.push(keebab);
  await updateUserKebab.save();
  await keebab.save();
  return res.send();
});

// requesting someone elses tweets
router.get("/:id", async (req, res) => {
  if (!req.user) {
    res.redirect(redirectLink);
  }
  const profileID = req.params.id;
  // const getProfileTweet = await User.find({ _id: profileID }).populate("user", {
  //   username: 1,
  // });
  res.send(getProfileTweet);
});

router.delete("/:id", async (req, res) => {
  if (!req.user) {
    res.redirect(redirectLink);
  }
});

router.put("/like/:id");
router.put("/rekebab/:id"); //update the date so yeah...

module.exports = router;
