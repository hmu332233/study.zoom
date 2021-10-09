const socket = io();

const myFace = document.getElementById('myFace');
const muteBtn = document.getElementById('mute');
const cameraBtn = document.getElementById('camera');

let muted = false;
let cameraOff = false;

(async () => {
  // const myStream = await getMedia();
  // myFace.srcObject = myStream;
})();

async function getMedia() {
  try {
    return await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

  } catch(err) {
    /* 오류 처리 */
    console.error(err);
  }
}


function handleMuteClick() {
  if (!muted) {
    muteBtn.innerHTML = 'Unmute';
    muted = true;
  } else {
    muteBtn.innerHTML = 'Mute';
    muted = false;
  }
}

function handleCameraClick() {
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
