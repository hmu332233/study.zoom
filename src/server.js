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
  socket.nickname = 'Anon';
  console.log('Connected to Client');
  socket.on('message', (message) => {
    console.log(message.toString())
    const { type, payload } = JSON.parse(message.toString());

    if (type === 'new_message') {
      
    } else {

    }

    switch (type) {
      case 'new_message':
        sockets.forEach(aSocket => aSocket.send(`${socket.nickname}: ${payload}`));
        break;
      case 'nickname':
        socket.nickname = payload;
        break;
    }
    
  });
  socket.on('close', () => {
    console.log('Disconnected to Client');
  });
});

server.listen(3000, handleListen);