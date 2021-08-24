const router = require("express").Router();
const User = require("../model/user");
const Kebab = require("../model/kebab");

const redirectLink = "http://localhost:3000/";

router.get("/feed", async (req, res, next) => {
  if (!req.user) {
    return res.sendStatus(401);
  }
  const allFeed = await Kebab.find({}).populate("user", {
    username: 1,
  }); // be sure to .sort the objects by date,front end
  return res.json(allFeed).status(200);
});

router.post("/", async (req, res) => {
  if (!req.user) {
    return res.sendStatus(401);
  }

  try {
    const content = { content: req.body.content, user: req.token.id };
    const newKebab = new Kebab(content);
    console.log(newKebab);
    const updateUserKebab = await User.findById(req.token.id);

    updateUserKebab.kebab.push(newKebab);
    await updateUserKebab.save();
    await newKebab.save();

    return res.send(newKebab);
  } catch (err) {
    return res.send(err).status(400);
  }
});

// requesting someone elses tweets
router.get("/:id", async (req, res) => {
  if (!req.user) {
    return res.sendStatus(401);
  }
  try {
    const profileID = req.params.id;
    const getProfileTweet = await Kebab.find({ user: { _id: profileID } });
    return res.send(getProfileTweet).status(200);
  } catch (err) {
    return res.send(err).status(400);
  }
});

router.delete("/:id", async (req, res) => {
  if (!req.user) {
    return res.sendStatus(401);
  }
  const kebabID = req.params.id;
  if (kebabID) {
    console.log(req.user.kebab.includes(kebabID));
    if (req.user.kebab.includes(kebabID)) {
      try {
        await Kebab.findByIdAndDelete(kebabID); // from kebab
        await User.updateOne(
          //user->kebab->id->delete
          // del from user
          { _id: req.user.id },
          { $pullAll: { kebab: [kebabID] } }
        );
        return res.send(200);
      } catch (error) {
        return res.send(error);
      }
    } else {
      return res.sendStatus(400);
    }
  }
});

router.put("/like/:id", async (req, res, next) => {
  if (!req.user) {
    return res.sendStatus(401);
  }
  const kebabID = req.params.id;
  const like = req.body.like;
  try {
    await Kebab.findByIdAndUpdate(kebabID, { likes: like });
    return res.sendStatus(200);
  } catch (error) {
    return res.send(error).status(400);
  }
});
router.put("/rekebab/:id", async (req, res, next) => {
  if (!req.user) {
    return res.sendStatus(401);
  }
  const kebabID = req.params.id;
  const reKebab = req.body.reKebab;
  try {
    await Kebab.findByIdAndUpdate(kebabID, {
      reKebabs: reKebab,
      date: Date.now,
    });
    return res.sendStatus(200);
  } catch (error) {
    return res.send(error).status(400);
  }
}); //update the date so yeah...

module.exports = router;
