const socket = io(); // 기본적으로 WebSocket와 달리 페이지를 랜더링하는 동일한 서버에 알아서 연결함

const welcome = document.getElementById('welcome');
const form = welcome.querySelector('form');

const room = document.getElementById('room');


let roomName = '';

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
  });
  roomName = input.value;
  input.value = '';
}

form.addEventListener('submit', handleRoomSubmit);