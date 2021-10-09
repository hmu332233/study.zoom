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

    cameras.forEach(camera => {
      const option = document.createElement('option');
      option.value = camera.deviceId;
      option.innerText = camera.label;

      camerasSelect.appendChild(option);
    });
  } catch (err) {
    console.error(err);
  }
}

async function getMedia() {
  try {
    // 미디어 스트림 가져오기
    myStream = await await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    myFace.srcObject = myStream;
    await getCameras();
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

muteBtn.addEventListener('click', handleMuteClick);
cameraBtn.addEventListener('click', handleCameraClick);
