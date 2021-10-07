import http from 'http';
import SocketIo from 'socket.io';
import express from 'express';

const app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use('/public', express.static(__dirname + '/public'));
app.get('/', (req, res) => res.render('home'));

const handleListen = () => console.log(`Listening on http://localhost:3000 ws://localhost:3000`);

// http server
const server = http.createServer(app);
// socket server
const io = SocketIo(server);

io.on('connection', (socket) => {
  console.log(socket);
})

server.listen(3000, handleListen);