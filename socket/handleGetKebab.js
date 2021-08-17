const Kebab = require("../model/kebab");
module.exports = (io, socket) => {
  const getKebabs = () => {
    var kebabCursor = Kebab.find({}) //query
      .populate("user", {
        username: 1,
      })
      .cursor(); //stream wrapper on stream3

    // CURSOR LISTENERS
    kebabCursor.on("data", (docs) => {
      socket.emit("kebab-feed", docs); //emit
    });
    kebabCursor.on("error", (err) => {
      socket.emit("kebab-error", err);
    });
  };
  socket.on("get:kebab", getKebabs); //getkebabs is what happens when get:kebab event happens
};
