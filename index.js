require('dotenv').config()
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const { newUser, getIndividualRoomUsers, getActiveUser, exitRoom } = require('./helper/userHelper')
const formatMessage = require("./helper/formatDate");
const path = require('path')
const app = express()
const server = http.createServer(app)
const PORT = process.env.PORT || 3000
const io = socketio(server)

app.use(express.static(path.join(__dirname, 'public')))

io.on('connection', (socket) => {
	socket.on('joinRoom', ({ username, room }) => {
		const user = newUser(socket.id, username, room)
		socket.join(user.room)
		socket.emit('message', formatMessage('Admin', 'Message on this channel is limited to this channel'))
        socket.broadcast.to(user.room).emit('message', formatMessage(user.username, `${user.username} has joined the room`))
        io.to(user.room).emit('roomUsers',{
            room: user.room,
            users: getIndividualRoomUsers(user.room)
        })
	})
    socket.on('chatMessage', msg => {
        const user = getActiveUser(socket.id)
        io.to(user.room).emit('message', formatMessage(user.username, msg))
    })
    socket.on('disconnect', () =>{
        const user = exitRoom(socket.id)
        if(user){
            io.to(user.room).emit('message', formatMessage('Admin', `${user.username} has left the room`))
        }

        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getIndividualRoomUsers(user.room)
        })
    })
})

server.listen(PORT, () => {
	console.log(`Listening on ${PORT}`)
})
