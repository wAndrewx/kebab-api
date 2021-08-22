const jwt = require("jsonwebtoken");
const User = require("./model/user");
const app = require("./app");
const httpServer = require("http").Server(app);
const options = {
  cors: { origin: true },
};
const io = require("socket.io")(httpServer, options);
const getKebab = require("./socket/handleGetKebab"); //routes
const createKebab = require("./socket/handleNewKebab"); //routes
app.set("socketio", io);

// for https makes sure you get your ssl certs
io.use(async (socket, next) => {
  let token = socket.handshake.auth.token;
  if (token) {
    token = token.split(" ");
    if (token.length > 0 && token[0].includes("Bearer")) {
      const jwtVerify = jwt.verify(token[1], process.env.JWT_SECRET);
      socket.token = jwtVerify;
      socket.user = await User.findOne({ _id: jwtVerify.id });
    }
  }
  next();
});
const onConnection = (socket) => {
  //function for on connection instead of writing it inline
  console.log("Connected:", socket.id);
  // console.log(socket.request);
  socket.on("disconnect", () => {
    //listening when disconnect
    console.log("ID:", socket.id, "disconnected");
    socket.removeAllListeners();
  });

  if (socket.user) {
    getKebab(io, socket);
    createKebab(io, socket);
  } // routes}
};
io.on("connect", onConnection); // on connection do these tasks

const PORT = 8080; // || process.env.PORT
var server = httpServer.listen(PORT, () => {
  console.log("Listening to port:", server.address().port);
});
