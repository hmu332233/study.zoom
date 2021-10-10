const socket = io();

const myFace = document.getElementById('myFace');
const muteBtn = document.getElementById('mute');
const cameraBtn = document.getElementById('camera');

const camerasSelect = document.getElementById('cameras');

let muted = false;
let cameraOff = false;


getMedia();

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
    // 미디어 스트림 가져오기
    myStream = await await navigator.mediaDevices.getUserMedia(
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
