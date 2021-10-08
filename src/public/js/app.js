const socket = io(); // 기본적으로 WebSocket와 달리 페이지를 랜더링하는 동일한 서버에 알아서 연결함

const welcome = document.getElementById('welcome');
const form = welcome.querySelector('form');


function handleRoomSubmit(event) {
  event.preventDefault();
  const input = form.querySelector('input');
  socket.emit('enter_room', { payload: input.value }, (message) => {
    // 서버에서 callback 함수가 불렸을 경우 실행이 됨
    console.log('server is done!');
    console.log(message);
  });
  input.value = '';
}

form.addEventListener('submit', handleRoomSubmit);