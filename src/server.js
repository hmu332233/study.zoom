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
  
  // ws 구현체와 차이, event 이름이 자유로움, object 형식 전달 가능
  socket.on('enter_room', (message, callback) => {
    console.log(message);

    // callback 함수를 호출함으로써 client에 어떤 작업이 끝났음을 알려주는게 가능
    setTimeout(() => callback(), 3000);
  });

})

server.listen(3000, handleListen);