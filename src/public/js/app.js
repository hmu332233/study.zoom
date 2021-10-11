const socket = io();

const call = document.getElementById('call');

const myFace = document.getElementById('myFace');
const muteBtn = document.getElementById('mute');
const cameraBtn = document.getElementById('camera');

const camerasSelect = document.getElementById('cameras');

let myStream;
let myPeerConnection;
let muted = false;
let cameraOff = false;
let roomName = '';


async function getCameras() {
  try {
    // 사용가능한 디바이스 목록 가져오기
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter(device => device.kind === 'videoinput');
    const currentCamera = myStream.getVideoTracks()[0]; // 어떤 카메라가 선택되어있는지 알 수 있음
    cameras.forEach(camera => {
      const option = document.createElement('option');
      option.value = camera.deviceId;
      option.innerText = camera.label;
      if (currentCamera.label === camera.label) {
        option.selected = true;
      }
      camerasSelect.appendChild(option);
    });
  } catch (err) {
    console.error(err);
  }
}

async function getMedia(deviceId) {
  const initialConstrains = {
    audio: true,
    video: { facingMode: 'user' }, // 모바일의 전면 카메라를 우선 사용
  }

  const cameraConstrains = {
    audio: true,
    video: { deviceId: { exact: deviceId }},
    // exact가 있으면 해당 deviceId로 device가 있으면 화면 표시 없으면 표시하지 않음
    // exact가 없으면 해당 deviceId로 device가 없어도 다른 device로 화면 표시
  }
  try {
    // 미디어 스트림 가져오기 - 카메라가 없어서 임시로 getDisplayMedia로 변경
    // myStream = await navigator.mediaDevices.getUserMedia(
    myStream = await navigator.mediaDevices.getDisplayMedia(
      deviceId ? cameraConstrains : initialConstrains
    );
    myFace.srcObject = myStream;

    getCameras();
  } catch(err) {
    /* 오류 처리 */
    console.error(err);
  }
}


function handleMuteClick() {
  // audio track enabled에 따라 소리 제어가 가능
  myStream
    .getAudioTracks()
    .forEach(track => track.enabled = !track.enabled);
  
  if (!muted) {
    muteBtn.innerHTML = 'Unmute';
    muted = true;
  } else {
    muteBtn.innerHTML = 'Mute';
    muted = false;
  }
}

function handleCameraClick() {
  // camera track enabled에 따라 소리 제어가 가능
  myStream
    .getVideoTracks()
    .forEach(track => track.enabled = !track.enabled);

  if (cameraOff) {
    cameraBtn.innerText = 'Turn Camera Off';
    cameraOff = false;
  } else {
    cameraBtn.innerText = 'Turn Camera On';
    cameraOff = true;
  }
}

function handleCameraChange() {
  getMedia(camerasSelect.value);
}

muteBtn.addEventListener('click', handleMuteClick);
cameraBtn.addEventListener('click', handleCameraClick);
camerasSelect.addEventListener('change', handleCameraChange);



// Welcome form (join a room)

const welcome = document.getElementById('welcome');
const welcomeForm = welcome.querySelector('form');

async function initCall() {
  welcome.hidden = true;
  call.hidden = false;
  await getMedia();
  makeConnection();
}

async function handleWelComeSubmit(event) {
  event.preventDefault();
  const input = welcomeForm.querySelector('input');
  await initCall();
  socket.emit('join_room', input.value);
  roomName = input.value;
  input.value = '';
}

welcomeForm.addEventListener('submit', handleWelComeSubmit);


// Socket Code

socket.on('welcome', async () => {
  // offer 생성 - step 3
  // offer 다른 브라우저가 참가할 수 있도록 초대장을 만드는 것
  // 코덱은 무엇들이 있으며, 어떤 프로토콜을 사용하고, 비트레이트는 얼마이며, 밴드위드스는 얼마이다 와 같은 데이터가 텍스트 형태로 명시되어 있다.
  const offer = await myPeerConnection.createOffer();

  // peer에게 local description 셋팅 - step 4
  await myPeerConnection.setLocalDescription(offer);

  // 생성한 offer를 시그널링 서버에 전송 - step5
  socket.emit('offer', offer, roomName);

  console.log('send the offer', offer);
});

socket.on('offer', async (offer) => {
  // 다른 peer가 보낸 offer를 받아서 remote description 셋팅 - step6  
  myPeerConnection.setRemoteDescription(offer);

  // answer 생성 - step7
  const answer = await myPeerConnection.createAnswer();

  // peer에세 answer로 local description 셋팅 - step8
  myPeerConnection.setLocalDescription(answer);

  // 생성한 answer를 시그널링 서버에 전송 - step9
  socket.emit('answer', answer, roomName);
});

socket.on('answer', async (answer) => {
  // 다른 peer가 보낸 answer를 받아서 remote description 셋팅 - step10
  myPeerConnection.setRemoteDescription(answer);
});

// RTC Code

function makeConnection() {
  // peer connection 생성 - step1
  myPeerConnection = new RTCPeerConnection();

  // 영상과 오디오를 주고 받기 위해 peerConnection에 video track, audio track들을 넣어준다 - step2
  myStream.getTracks().forEach(track => myPeerConnection.addTrack(track, myStream));
}