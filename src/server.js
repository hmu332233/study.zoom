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

  socket.onAny(event => {
    console.log(`Socket Event: ${event}`);
  });
  
  // ws 구현체와 차이, event 이름이 자유로움, object 형식 전달 가능
  // https://socket.io/docs/v4/emitting-events/
  socket.on('enter_room', (message, callback) => { // 마지막 인자는 함수가 될 수 있고 데이터를 전송해주는게 가능
    console.log(message);
    const { payload: roomName } = message;

    socket.join(roomName);

    // callback 함수를 호출함으로써 client에 작업이 끝났다는 사실 및 데이터를 전송 가능
    callback({ status: 'DONE' });

    socket.to(roomName).emit('welcome');
  });

})

server.listen(3000, handleListen);