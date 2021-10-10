# study.zoom


- websocket_src
  - websocket 학습용 디렉토리
  - https://www.npmjs.com/package/ws
- socketio_src
  - socketio 학습용 디렉토리
  - https://socket.io/
  - client와 server 간 실시간 통신을 가능하게 해주는 프레임워크
  - websocket을 지원하지 않아도 http long-polling 등을 이용하여 real-time event 통신을 지원함
- src (main)
  - webrtc 학습용 디렉토리
  - peer-to-peer로 구현 예정, 서버는 signaling을 위해서만 사용됨
    - peer-to-peer 브라우저간 직접 연결되어 서버를 거치지 않고 데이터를 주고 받음
    - signaling 우리 브라우저로 하여금 서버가 상대가 어디있는지 알게하는 것
      - 위치, settings, configuration, 방화벽, 라우터 등등
  - 주요 api
    - getUserMedia: 사용자 단말기의 미디어 장치를 액세스할 수 있는 방법을 제공. getUserMedia 를 통해 미디어 장치를 액세스 하게 되면 미디어 스트림 객체를 얻을 수 있으며 이를 PeerConnection에 전달하여 미디어 스트림을 전송한다.
    - PeerConnection: 가장 중요한 API 이면서 Peer 간의 화상과 음성 등을 교환하기 위한 거의 모든 작업을 수행하는 API, WebRTC 어플리케이션이 Peer 간의 연결을 생성하고 오디오와 비디오의 통신에 사용되는 API
    - DataChannel: Peer 간에 텍스트나 파일을 주고 받을 수 있는 메시징 API

  - 연결 방법 (A와 B가 서로 연결한다고 할 때)

    - step0: (A, B) getUserMedia를 통해 stream을 가져옴
    - step1: (A) peer connection 생성
    - step2: (A) 영상과 오디오를 주고 받기 위해 peerConnection에 video track, audio track들을 넣어주기
    - step3: (A) offer 생성
    - step4: (A) setLocalDescription
    - step5: (A) 생성한 offer를 시그널링 서버에 전송
    - step6: (B) 시그널링 서버로부터 offer를 받아 ... [진행 중]
