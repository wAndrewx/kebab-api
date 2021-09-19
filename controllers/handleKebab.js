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

  // console.log(req.user.verified)
  if (!req.user.verified) {
    return res.send({ message: "Please verify to post a tweet" });
  }

  try {
    const content = { content: req.body.content, user: req.token.id };
    const newKebab = new Kebab(content);
    const updateUserKebab = await User.findById(req.token.id);

    updateUserKebab.kebab.push(newKebab);
    await updateUserKebab.save();
    await newKebab.save();

    let newKebabPop = await Kebab.findById(newKebab._id).populate("user", {
      username: 1,
    });
    return res.send(newKebabPop);
  } catch (err) {
    return res.send(err).status(400);
  }
});

// requesting someone elses tweets
router.get("/profile/:id?", async (req, res) => {
  // let username = req.query.username;
  const profileID = req.params.id; //find user from username then use that as id

  if (!req.user || !profileID) {
    return res.sendStatus(401);
  }

  try {
    // if (!username && profileID) {
    const getProfileTweet = await Kebab.find({
      user: { _id: profileID },
    }).populate("user", {
      username: 1,
    });
    return res.json(getProfileTweet).status(200);
    // } else if (username && !profileID) {
    //   const getProfileWithUsername = await Kebab.find({
    //     user: { username: username },
    //   }).populate("user", {
    //     username: 1,
    //   });
    //   return res.json(getProfileWithUsername).status(200);
    // }
  } catch (err) {
    return res.send(err).status(400);
  }
});

router.delete("/:id", async (req, res) => {
  if (!req.user) {
    return res.sendStatus(401);
  }
  //user->kebab->id->delete
  // del from user
  const kebabID = req.params.id; // id of tweet.

  if (kebabID) {
    console.log(req.user.kebab.includes(kebabID));
    try {
      if (req.user.kebab.includes(kebabID)) {
        await Kebab.findByIdAndDelete(kebabID); // from kebab
        await User.updateOne(
          { _id: req.user.id },
          { $pullAll: { kebab: [kebabID] } }
        );
        return res.sendStatus(200);
      } else {
        return res.status(400).send({ message: "Not your tweet" });
      }
    } catch (error) {
      return res.send(error);
    }
  }
});

router.put("/like/:id", async (req, res, next) => {
  const kebabID = req.params.id; //id of tweet
  if (!req.user || !kebabID) {
    return res.sendStatus(400);
  } // check if the kebab is created by user

  try {
    if (req.user.tweetsLiked.includes(kebabID)) {
      // if found dislike, sync up with front end
      // unlike
      await Kebab.findByIdAndUpdate(kebabID, {
        $pull: { usersLiked: req.user.id },
        $inc: { likes: -1 },
      });
      await User.findByIdAndUpdate(req.user.id, {
        $pull: { tweetsLiked: kebabID },
      });
      console.log("Unlike");
    } else {
      await Kebab.findByIdAndUpdate(kebabID, {
        $push: { usersLiked: req.user.id },
        $inc: { likes: 1 },
      });
      await User.findByIdAndUpdate(req.user.id, {
        $push: { tweetsLiked: kebabID },
      });
      console.log("Like");
    }
    return res.sendStatus(200); // return the length of usersLiked
  } catch (error) {
    return res.status(400).send(error);
  }
});
router.put("/rekebab/:id", async (req, res, next) => {
  const kebabID = req.params.id; // id of tweet
  if (!req.user || !kebabID) {
    return res.sendStatus(401);
  }
  try {
    if (req.user.tweetsRetweeted.includes(kebabID)) {
      // if found dislike, sync up with front end
      // unlike
      await Kebab.findByIdAndUpdate(kebabID, {
        $pull: { usersRetweet: req.user.id },
        $inc: { reKebabs: -1 },
      });
      await User.findByIdAndUpdate(req.user.id, {
        $pull: { tweetsRetweeted: kebabID },
      });
    } else {
      await Kebab.findByIdAndUpdate(kebabID, {
        $push: { usersRetweet: req.user.id },
        $inc: { reKebabs: 1 },
      });
      await User.findByIdAndUpdate(req.user.id, {
        $push: { tweetsRetweeted: kebabID },
      });

      await Kebab.findByIdAndUpdate(kebabID, {
        date: new Date(),
      });
    }
    return res.sendStatus(200);
  } catch (error) {
    return res.send(error).status(400);
  }
}); //update the date so yeah...

module.exports = router;
