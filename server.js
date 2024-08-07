require('dotenv').config()
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const users_routes = require("./src/routes/auth")
const users_data = require("./src/routes/user")
const connectDB = require("./src/db/connect");
const responseService= require("./src/services/response")
const http = require("http")
const { Server } = require('socket.io');
const userStreamModel = require("./src/models/stream-model");

const app = express()
const PORT = process.env.PORT||5000;

let users = [];
const addUser = (userId, socketId) => {
  // Check if any user in the array has the same userId
  if (!users.some(user => user.userId === userId)) {
    // Push an object containing userId and socketId to the users array
    users.push({ userId, socketId });
  }
};
const removeUser = (socketId) => {
  // Remove the user with the specified socketId from the users array
  users = users.filter(user => user.socketId !== socketId);
};



app.use(cors());
app.use(bodyParser.json());
app.use(responseService)
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });
  let rooms={}
  let youtubeLinks = [
    "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Rick Astley - Never Gonna Give You Up
    // Katy Perry - Roar
  ];
  
app.get("/",(req,res)=>{
    const randomString = Math.random().toString(36).substring(7);
res.send("abhi");
})

app.use("/api/users", users_routes)
app.use("/api/userdata", users_data)

io.on('connection', (socket) => {

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });
  
    socket.on("addUsers", (data) => {
      addUser(data, socket.id);
      io.emit("newUser", "connected");
    });
  
    socket.on('join chat', async(data) => {
      const { userId } = data;
      let roomToJoin = null;

      // Check for an available room with less than one user
      for (let i = 0; i < youtubeLinks.length; i++) {
        const room = `room-${i}`;
        if (!rooms[room]) {
          rooms[room] = [];
        }
    
        if (rooms[room].length < 1) {
          roomToJoin = room;
          rooms[room].push(socket.id);  // Store socket.id instead of userId
          break;
        }
      }
    
      if (roomToJoin) {
        // Join the room
        socket.join(roomToJoin);
        socket.emit('message', {link:`${youtubeLinks[parseInt(roomToJoin.split('-')[1])]}`, success: true});
        try {
            await userStreamModel.findOneAndUpdate(
                { userId }, // Search by userId
                { $push: { links: youtubeLinks[parseInt(roomToJoin.split('-')[1])] } }, // Add the YouTube link to the links array
                { upsert: true, new: true } // Create a new document if it doesn't exist
            );

        } catch (error) {
            console.error('Error updating user stream:', error);
        }
        // Emit the updated user list to all clients in the room
        io.to(roomToJoin).emit('users', rooms[roomToJoin]);
      } else {
        // All rooms are filled
        socket.emit('message', {success: false});
      }
      
    });
  
    socket.on('disconnect', () => {
        let roomToEmpty = null;
        console.log("User disconnected:", socket.id);

        for (const room in rooms) {
          const userIndex = rooms[room].indexOf(socket.id);
          if (userIndex !== -1) {
            // Remove the user from the room
            rooms[room].splice(userIndex, 1);

            // Check if the room is now empty
            if (rooms[room].length === 0) {
              roomToEmpty = room;
            }
            break;   
          }
        }
      
        // If the room is empty, delete it
        if (roomToEmpty) {
          delete rooms[roomToEmpty];
        }
      
        console.log("Updated rooms after disconnection:", rooms);
      
        // Notify all clients about the updated user list
        io.emit('users', rooms);
    });
});



const start = async () =>{
    try{
        await connectDB(process.env.MONGO_URI)
        server.listen(PORT,()=>{
            console.log(`Server is running on http://localhost:${PORT}`)
        })
    }
    catch(error){
        console.log(error)
    }
}
start()