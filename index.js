const app = require("./app");
const httpServer = require("http").Server(app);
const options = {
  cors: { origin: "*" },
};
const io = require("socket.io")(httpServer, options);

const createNewKebab = require("./socket/handleNewKebab"); // socket middleware for kebabs
const getKebab = require("./socket/handleGetKebab");
// for https makes sure you get your ssl certs

// io.on("connect", (socket) => {
//   //broadcast my tweet to every socket connected
//   console.log("User Connected:", socket.id);
//   // console.log(socket)
//   socket.emit("poop", "server says you got shit on");
//   socket.on("disconnect", () => {
//     console.log("User disconnected");
//   });
// });

//already connected to mongodb in express app

const onConnection = (socket) => { //function for on connection instead of writing it inline
  console.log("Connected:", socket.id);
  socket.on("disconnect", () => { //listening when disconnect
    console.log("ID:", socket.id, "disconnected");
  });

  createNewKebab(io, socket); // middleware
  getKebab(io, socket);
};

io.on("connect", onConnection); // on connection do these tasks

const PORT = 8080; // || process.env.PORT
var server = httpServer.listen(PORT, () => {
  console.log("Listening to port:", server.address().port);
});
