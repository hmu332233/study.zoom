import http from 'http';
import WebSocket from 'ws';
import express from 'express';

const app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use('/public', express.static(__dirname + '/public'));
app.get('/', (req, res) => res.render('home'));

const handleListen = () => console.log(`Listening on http://localhost:3000 ws://localhost:3000`);

// http server
const server = http.createServer(app);
// web socket server
const wss = new WebSocket.Server({ server }); // http server 없이 web socket server만 띄워도 된다.

const sockets = [];

wss.on('connection', (socket) => {
  sockets.push(socket);
  console.log('Connected to Client');
  socket.on('message', (message) => {
    sockets.forEach(aSocket => aSocket.send(message.toString()));
  });
  socket.on('close', () => {
    console.log('Disconnected to Client');
  });
});

server.listen(3000, handleListen);