module.exports = (io, socket) => {
  const createKebab = async () => {
    //create new kebab
    //listen to info from emitted arguments
    //put in object {content:args1}....
    //add to mongo -> save etc...
    //emit data back to client of what kebab client just made
    //
  };
  socket.on("create:kebab", createKebab);
};
