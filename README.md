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