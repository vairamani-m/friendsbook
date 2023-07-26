require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const SocketServer = require('./socketServer')
const { PeerServer, ExpressPeerServer } = require('peer')

const authRouter = require('./routes/authRouter')
const userRouter = require('./routes/userRouter')
const postRouter = require('./routes/postRouter')
const commentRouter = require('./routes/commentRouter')
const notifyRouter = require('./routes/notifyRouter')
const messageRouter = require('./routes/messageRouter')

const app = express()
app.use(express.json())
app.use(cors())
app.use(cookieParser())

// Socket
const http = require('http').createServer(app)
const io = require('socket.io')(http)

io.on('connection', socket => {
    SocketServer(socket)
})

// Create Peer Server
// PeerServer({ port: 3001, path: '/' })
ExpressPeerServer(http, { path: '/' })

// Routes
app.use('/api', authRouter)
app.use('/api', userRouter)
app.use('/api', postRouter)
app.use('/api', commentRouter)
app.use('/api', notifyRouter)
app.use('/api', messageRouter)

app.get('/', (req, res) => {
    res.json({message:'Hello Friendsbook'})
})

const URL = process.env.MONGODB_URL;

mongoose.set('strictQuery', true);
mongoose.connect(URL, {
    // useCreateIndex: true,
    // useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
}, err =>{
    if(err) throw err;
    console.log('connected to mongodb');
})
const port = process.env.PORT || 5000;

http.listen(port, () => {
    console.log('Server is running on port', port);
})  
