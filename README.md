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
  - https://webrtc.org/getting-started/overview
  - peer-to-peer로 구현 예정, 서버는 signaling을 위해서만 사용됨
    - peer-to-peer 브라우저간 직접 연결되어 서버를 거치지 않고 데이터를 주고 받음
    - signaling 우리 브라우저로 하여금 서버가 상대가 어디있는지 알게하는 것
      - 위치, settings, configuration, 방화벽, 라우터 등등
  - 주요 api
    - getUserMedia: 사용자 단말기의 미디어 장치를 액세스할 수 있는 방법을 제공. getUserMedia 를 통해 미디어 장치를 액세스 하게 되면 미디어 스트림 객체를 얻을 수 있으며 이를 PeerConnection에 전달하여 미디어 스트림을 전송한다.
    - PeerConnection: 가장 중요한 API 이면서 Peer 간의 화상과 음성 등을 교환하기 위한 거의 모든 작업을 수행하는 API, WebRTC 어플리케이션이 Peer 간의 연결을 생성하고 오디오와 비디오의 통신에 사용되는 API
    - DataChannel: Peer 간에 텍스트나 파일을 주고 받을 수 있는 메시징 API
    - RTCRtpSender: peer로 보내진 media stream track을 컨트롤할 수 있게 해주는 객체

  - 연결 방법 (A와 B가 서로 연결한다고 할 때)

    - step0: (A, B) getUserMedia를 통해 stream을 가져옴
    - step1: (A, B) peer connection 생성
    - step2: (A, B) 영상과 오디오를 주고 받기 위해 peerConnection에 video track, audio track들을 넣어주기
    - step3: (A) offer 생성
    - step4: (A) offer로 setLocalDescription
    - step5: (A) 생성한 offer를 시그널링 서버에 전송
    - step6: (B) 시그널링 서버로부터 offer를 받아 setRemoteDescription
    - step7: (B) answer 생성
    - step8: (B) answer로 setLocalDescription
    - step9: (B) 생성한 answer를 시그널링 서버에 전송
    - step10: (A) 시그널링 서버로부터 answer를 받아 setRemoteDescription

    - step11: (A, B) offer, answer 교환 이후 icecandidate를 서로 교환
    - step12: (A, B) 받은 icecandidate를 peerConnection에 추가
    - step13: (A, B) 서로 연결이 되고 addstream 이벤트가 불려서 상대의 stream을 받아 사용할 수 있게 됨


  - 용어(참고: http://hacks.mozilla.or.kr/2013/08/webrtc-and-the-ocean-of-acronyms/)
    - ICE (Internet Connectivity Establishment)
      - 웹 브라우저 간에 피어 투 피어 접속을 할 수 있게 해 주는 프레임워크
    - icecandidate
      - RTCPeerConnection을 구축 할 때 사용되기도하는 ICE의 후보군(candidate).
    
