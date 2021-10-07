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

wss.on('connection', (socket) => {
  console.log('Connected to Client');
  socket.on('message', (message) => {
    console.log(message);
  });
  socket.on('close', () => {
    console.log('Disconnected to Client');
  });
  socket.send('hello');
});

server.listen(3000, handleListen);