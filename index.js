const app = require('./app');
const httpServer = require("http").Server(app);

const options = {
  cors: { origin: "*" },
};

const io = require("socket.io")(httpServer, options);

// for https makes sure you get your ssl certs

io.on("connection", (socket) => {
  console.log("User Connected:",socket.id);
// socket.emit("yo")
  socket.on("disconnect", () => {
    console.log("User disconnected");
    
  });
});

io.on("connection",(socket)=>{
    socket.on('kebabDisplay',()=>{
      console.log('I just made a kebab')
      
    })
})



const PORT = 8080; // || process.env.PORT
var server = httpServer.listen(PORT, () => {
  console.log("Listening to port:", server.address().port);
});
