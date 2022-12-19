const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const User = require("./models/userModel");
const { find } = require("./models/userModel");

//creating server with socket io
const app = express();
const server = http.createServer(app);
const io = socketio(server);

//serving static files
app.use(express.static(path.join(__dirname, "public")));

//Run when client connect(connection event)
//1) user connection from browser from (script main.js)
io.on("connection", (socket) => {
  console.log(`New WS Connection......`);
  //2)listen to joinRoom event
  socket.on("joinRoom", async ({ username, room }) => {
    const body = { username, room, socketId: socket.id }; //we add socket.id from socket object because we can need get access to the DB by socket object
    const user = await User.create(body);
    socket.join(user.room); //to identify the room

    //3)after user connection we want to emit message to user
    //A--)using emit(to single client that connecting)
    socket.emit(
      "message",
      new formatMessage(username, "Welcome to live chatCord app")
    );
    //B--)using broadcast.emit(to all client except that the user is connecting)
    //the diference between socket.broadcast.emit ,socket.emit -->
    // broadcast.emit we actually emit to every body except thats connecting
    socket.broadcast
      .to(user.room) //to emit this broadcast to specific room(in the room contained the new user)
      .emit(
        "message",
        new formatMessage(username, `${user.username} has joined to the chat`)
      );
    //c--)to everybody(to all client in general)
    //send users and room  info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: await User.find({ room: user.room }),
    });
  });

  //4)listen to the chat message
  socket.on("chatMessage", async ({ msg, username }) => {
    const user = await User.findOne({ username });
    console.log(user);
    io.to(user.room).emit("message", new formatMessage(user.username, msg));
  });

  //5)Run when client dissconect
  socket.on("disconnect", async (res) => {
    console.log(res);
    const user = await User.findOne({ socketId: socket.id }); //because we cant access user so we add socket.id to search in DB by socket object
    console.log(`${user} 1`);
    await User.findOneAndDelete({ socketId: socket.id }); //to delete user from DB
    console.log(`${user} 2`);

    io.to(user.room).emit(
      "message",
      new formatMessage("chatCord", `${user.username} has left the chat`)
    );
    //send Users and room info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: await User.find(),
    });
  });
});

console.log("start app.js");
module.exports = server;
