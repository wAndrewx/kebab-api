const jwt = require("jsonwebtoken");
const User = require("./model/user");
const app = require("./app");
const httpServer = require("http").Server(app);

// for https makes sure you get your ssl certs


const PORT = 8080; // || process.env.PORT
var server = httpServer.listen(PORT, () => {
  console.log("Listening to port:", server.address().port);
});
