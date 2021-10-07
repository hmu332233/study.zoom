

const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener('open', () => {
  console.log('Connected to Server');
})

socket.addEventListener('message', (message) => {
  console.log('Just got this: ', message.data, 'from the server');

  const $li = document.createElement('li');
  $li.innerText = message.data;
  $ul.append($li);
});

socket.addEventListener('close', () => {
  console.log('Closed');
});


const $ul = document.querySelector('ul');
const $messageForm = document.querySelector('#message');
const $nickForm = document.querySelector('#nick');

$messageForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const $input = $messageForm.querySelector('input');
  console.log($input.value);
  socket.send(makeMessage('new_message', $input.value));
  $input.value = '';
});

$nickForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const $input = $nickForm.querySelector('input');
  socket.send(makeMessage('nickname', $input.value));
});


function makeMessage(type, payload) {
  const message = { type, payload };
  return JSON.stringify(message);
}