

const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener('open', () => {
  console.log('Connected to Server');
})

socket.addEventListener('message', (message) => {
  console.log('Just got this: ', message.data, 'from the server');
});

socket.addEventListener('close', () => {
  console.log('Closed');
});


const $ul = document.querySelector('ul');
const $form = document.querySelector('form');

$form.addEventListener('submit', (event) => {
  event.preventDefault();
  const $input = $form.querySelector('input');
  console.log($input.value);
  socket.send($input.value);
  $input.value = '';
});
