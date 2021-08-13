const router = require("express").Router();
const User = require("../model/user");
const Kebab = require("../model/kebab");

const redirectLink = "http://localhost:3000/";

router.get("/feed", async (req, res, next) => {
  if (!req.user) {
    return res.redirect(redirectLink);
  }
  const allFeed = await Kebab.find({}).populate("user", {
    username: 1,
  }); // be sure to .sort the objects by date,front end
  return res.json(allFeed);
});

router.post("/", async (req, res) => {
  if (!req.user) {
    return res.redirect(redirectLink);
  }
  try {
    const content = { content: req.body.content, user: req.token.id };
    const keebab = new Kebab(content);
    const updateUserKebab = await User.findById(req.token.id);

    updateUserKebab.kebab.push(keebab);
    await updateUserKebab.save();
    await keebab.save();
    return res.send();
  } catch (err) {
    return res.send(err);
  }
});

// requesting someone elses tweets
router.get("/:id", async (req, res) => {
  if (!req.user) {
    return res.redirect(redirectLink);
  }
  try {
    const profileID = req.params.id;
    const getProfileTweet = await Kebab.find({ user: { _id: profileID } });
    return res.send(getProfileTweet);
  } catch (err) {
    return res.send(err);
  }
});

router.delete("/:id", async (req, res) => {
  if (!req.user) {
    return res.redirect(redirectLink);
  }
  const kebabID = req.params.id;
  if (kebabID) {
    console.log(req.user.kebab.includes(kebabID));
    if (req.user.kebab.includes(kebabID)) {
      try {
        await Kebab.findByIdAndDelete(kebabID); // from kebab
        await User.updateOne(
          // del from user
          { _id: req.user.id },
          { $pullAll: { kebab: [kebabID] } }
        );
        return res.send({ message: "deleted" });
      } catch (error) {
        return res.send(error);
      }
    }
  }
});

router.put("/like/:id");
router.put("/rekebab/:id"); //update the date so yeah...

module.exports = router;
