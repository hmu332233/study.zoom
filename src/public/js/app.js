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
		const cameras = devices.filter((device) => device.kind === 'videoinput');
		const currentCamera = myStream.getVideoTracks()[0]; // 어떤 카메라가 선택되어있는지 알 수 있음
		cameras.forEach((camera) => {
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
		video: { facingMode: 'user' } // 모바일의 전면 카메라를 우선 사용
	};

	const cameraConstrains = {
		audio: true,
		video: { deviceId: { exact: deviceId } }
		// exact가 있으면 해당 deviceId로 device가 있으면 화면 표시 없으면 표시하지 않음
		// exact가 없으면 해당 deviceId로 device가 없어도 다른 device로 화면 표시
	};
	try {
		// 미디어 스트림 가져오기 - 카메라가 없어서 임시로 getDisplayMedia로 변경
		// myStream = await navigator.mediaDevices.getUserMedia(
		myStream = await navigator.mediaDevices.getDisplayMedia(deviceId ? cameraConstrains : initialConstrains);
		myFace.srcObject = myStream;

		if (!deviceId) {
			getCameras();
		}
	} catch (err) {
		/* 오류 처리 */
		console.error(err);
	}
}

function handleMuteClick() {
	// audio track enabled에 따라 소리 제어가 가능
	myStream.getAudioTracks().forEach((track) => (track.enabled = !track.enabled));

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
	myStream.getVideoTracks().forEach((track) => (track.enabled = !track.enabled));

	if (cameraOff) {
		cameraBtn.innerText = 'Turn Camera Off';
		cameraOff = false;
	} else {
		cameraBtn.innerText = 'Turn Camera On';
		cameraOff = true;
	}
}

async function handleCameraChange() {
	await getMedia(camerasSelect.value);

	// peerConnection이 연결되어있을 경우 카메라 변경시 상대방과 연결된 stream에 관련된 부분도 변경
	if (myPeerConnection) {
		const newVideoTrack = myStream.getVideoTracks()[0];
		// sender: peer로 보내진 media stream track을 컨트롤할 수 있게 해주는 객체
		const videoSender = myPeerConnection.getSenders().find((sender) => sender.track.kind === 'video');
		// peer에 보내진 media stream에서 video track을 변경된 카메라의 track으로 변경
		videoSender.replaceTrack(newVideoTrack);
	}
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

	console.log('send the offer');
});

socket.on('offer', async (offer) => {
	console.log('received the offer');
	// 다른 peer가 보낸 offer를 받아서 remote description 셋팅 - step6
	myPeerConnection.setRemoteDescription(offer);

	// answer 생성 - step7
	const answer = await myPeerConnection.createAnswer();

	// peer에세 answer로 local description 셋팅 - step8
	myPeerConnection.setLocalDescription(answer);

	// 생성한 answer를 시그널링 서버에 전송 - step9
	socket.emit('answer', answer, roomName);

	console.log('send the answer');
});

socket.on('answer', async (answer) => {
	console.log('received the answer');

	// 다른 peer가 보낸 answer를 받아서 remote description 셋팅 - step10
	myPeerConnection.setRemoteDescription(answer);
});

// offer, answer 교환 이후 icecandidate(통신이 가능한 후보군)를 서로 교환 - step11
socket.on('ice', (ice) => {
	console.log('received candidate');
	// 받은 icecandidate를 peerConnection에 추가 - step12
	myPeerConnection.addIceCandidate(ice);
});

// RTC Code

function makeConnection() {
	// peer connection 생성 - step1
	myPeerConnection = new RTCPeerConnection({
    // STUN Server를 이용해서 공인 IP를 알아낼 수 있도록 함
		iceServers: [
			{
				urls: [
					'stun:stun.l.google.com:19302',
					'stun:stun1.l.google.com:19302',
					'stun:stun2.l.google.com:19302',
					'stun:stun3.l.google.com:19302',
					'stun:stun4.l.google.com:19302'
				]
			}
		]
	});
	myPeerConnection.addEventListener('icecandidate', handleIce);
	myPeerConnection.addEventListener('addstream', handleAddStream);

	// 영상과 오디오를 주고 받기 위해 peerConnection에 video track, audio track들을 넣어준다 - step2
	myStream.getTracks().forEach((track) => myPeerConnection.addTrack(track, myStream));
}

// offer, answer 교환 이후 icecandidate(통신이 가능한 후보군)를 서로 교환 - step11
function handleIce(data) {
	console.log('send candidate');

	socket.emit('ice', data.candidate, roomName);
}

// 서로 연결이 되고 addstream 이벤트가 불려서 상대의 stream을 받아 사용할 수 있게 됨 - step13
function handleAddStream(data) {
	console.log('got a stream from my peer');
	console.log("Peer's stream", data.stream);
	console.log('My stream', myStream);

	const peersStream = document.getElementById('peersStream');
	peersStream.srcObject = data.stream;
}
