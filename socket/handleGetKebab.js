const Kebab = require("../model/kebab");
module.exports = (io, socket) => {
  const getKebabs = () => {
    console.log("Attempting to get data");
    Kebab.find({})
      .populate("user", {
        username: 1,
      })
      .cursor()
      .on("data", (docs) => {
        // console.log(docs);
        socket.emit("kebab-feed", docs);
      })
      .on("error", (err) => {
        socket.emit("feed-error", err);
      });
  };
  socket.on("get:kebab", getKebabs);//getkebabs is what happens when get:kebab event happens
};
