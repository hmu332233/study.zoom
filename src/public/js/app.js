const socket = io(); // 기본적으로 WebSocket와 달리 페이지를 랜더링하는 동일한 서버에 알아서 연결함

const welcome = document.getElementById('welcome');
const form = welcome.querySelector('form');

const room = document.getElementById('room');


let roomName = '';

function addMessage(message) {
  const ul = room.querySelector('ul');
  const li = document.createElement('li');
  li.innerText = message;
  ul.append(li);
}

function hanleMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector('input');
  socket.emit('new_message', input.value, roomName, () => {
    addMessage(`You: ${input.value}`);
  });
  input.value = '';
}

function handleRoomSubmit(event) {
  event.preventDefault();
  const input = form.querySelector('input');
  socket.emit('enter_room', { payload: input.value }, (message) => {
    // 서버에서 callback 함수가 불렸을 경우 실행이 됨
    console.log('server is done!');
    console.log(message);

    welcome.hidden = true;
    room.hidden = false;

    const h3 = room.querySelector('h3');
    h3.innerText = `Room: ${roomName}`;

    const form = room.querySelector('form');
    form.addEventListener('submit', hanleMessageSubmit);
  });
  roomName = input.value;
  input.value = '';
}

form.addEventListener('submit', handleRoomSubmit);

socket.on('welcome', () => {
  addMessage('Someone joined!');
});

socket.on('bye', () => {
  addMessage('Someone left!');
});

socket.on('new_message', (message) => {
  addMessage(`Someone: ${message}`);
})