const User = require("../model/user");
const Kebab = require("../model/kebab");

module.exports = (io, socket) => {
  const newKebab = async (kebabContent) => {
    // console.log(content);
    // console.log(socket.token.id);
    const content = { content: kebabContent.content, user: socket.token.id };
    const newKebab = new Kebab(content);
    // console.log(newKebab);
    const updateUserKebab = await User.findById(socket.token.id);
    updateUserKebab.kebab.push(newKebab);
    await updateUserKebab.save();
    await newKebab.save();
    socket.emit("send:kebab", newKebab);
  };

  socket.on("post:kebab", newKebab);
};
