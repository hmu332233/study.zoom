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

function handleNickSubmit(event) {
  event.preventDefault();
  const input = room.querySelector('#nick input');
  socket.emit('nickname', input.value);
}

function handleMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector('#message input');
  socket.emit('new_message', input.value, roomName, () => {
    addMessage(`You: ${input.value}`);
    input.value = '';
  });
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

    const messageForm = room.querySelector('#message');
    messageForm.addEventListener('submit', handleMessageSubmit);

    const nameForm = room.querySelector('#nick');
    nameForm.addEventListener('submit', handleNickSubmit);
  });
  roomName = input.value;
  input.value = '';
}

form.addEventListener('submit', handleRoomSubmit);

socket.on('welcome', (nickname, userCount) => {
  const h3 = room.querySelector('h3');
  h3.innerText = `Room: ${roomName} (${userCount})`;
  addMessage(`${nickname} joined!` );
});

socket.on('bye', (nickname, userCount) => {
  const h3 = room.querySelector('h3');
  h3.innerText = `Room: ${roomName} (${userCount})`;
  addMessage(`${nickname} left!`);
});

socket.on('new_message', (message) => {
  addMessage(message);
});

socket.on('room_change', rooms => {
  const roomList = welcome.querySelector('ul');
  roomList.innerHTML = '';
  rooms.forEach(room => {
    const li = document.createElement('li');
    li.innerText = room;
    roomList.append(li);
  });
});