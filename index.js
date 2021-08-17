const app = require("./app");
const httpServer = require("http").Server(app);
const options = {
  cors: { origin: true },
};
const io = require("socket.io")(httpServer, options);
app.set("socketio", io);
const getKebab = require("./socket/handleGetKebab"); //routes
// for https makes sure you get your ssl certs

//already connected to mongodb in express app

const onConnection = (socket) => {
  //function for on connection instead of writing it inline
  console.log("Connected:", socket.id);
  // console.log(socket.request.user);

  socket.on("disconnect", () => {
    //listening when disconnect
    console.log("ID:", socket.id, "disconnected");
    socket.removeAllListeners();
  });

  getKebab(io, socket); // routes
};
io.on("connect", onConnection); // on connection do these tasks

const PORT = 8080; // || process.env.PORT
var server = httpServer.listen(PORT, () => {
  console.log("Listening to port:", server.address().port);
});
