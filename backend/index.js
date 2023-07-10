const express = require('express')
const app = express()
require('dotenv').config();
const port = process.env.PORT || 4000
const cors = require('cors');
const MongoDB = require('./db');
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
// const { Socket } = require('socket.io');
MongoDB();


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.use(cors({
    origin: "http://localhost:3000" ,
}));
app.use((req, res, next) => {
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});
app.use(express.json())
app.use('/api/user', require('./Routes/userRoutes'))
app.use('/api/chat', require('./Routes/chatRoutes'))
app.use('/api/message', require('./Routes/messageRoutes'))

app.use(notFound)
app.use(errorHandler)
const server = app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
const io = require("socket.io")(server, {
    
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000",
    },
});

io.on("connection", (socket) => {
    console.log("connected to socket.io");

    socket.on("setup", (userData) => {
        socket.join(userData._id);
        socket.emit("connected");
    });

    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("user joined room: " + room);
    });

    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.on("newmessage", (newMessageReceieved) => {
        var chat = newMessageReceieved.chat;
       
        if (!chat.users) return console.log("Users not defined");

        chat.users.forEach((user) => {
           
            if (user._id === newMessageReceieved.sender._id) return;

            socket.in(user._id).emit("message receieved", newMessageReceieved);
        });
    });
    socket.off("setup",()=>{
        console.log("User disconnected");
        socket.leave(userData._id)
    })

});

