# API Specification

## 사용자 관리
- **회원가입**: `POST /api/users/signup`
- **로그인**: `POST /api/users/login`
- **사용자 조회 (닉네임으로)**: `GET /api/users/nickname/{nickname}`
- **매칭 대상 조회**: `GET /api/users/{userId}/potential-matches`
- **프로필 수정**: `PUT /api/users/{userId}/profile`

## 강아지 관리
- **강아지 등록**: `POST /api/dogs/users/{userId}`
- **강아지 조회**: `GET /api/dogs/{dogId}`
- **강아지 상세 프로필 조회**: `GET /api/dogs/{dogId}/profile`
- **사용자의 강아지 목록 조회**: `GET /api/dogs/users/{userId}`
- **강아지 정보 수정**: `PUT /api/dogs/{dogId}`
- **강아지 삭제**: `DELETE /api/dogs/{dogId}`

## 스와이프
- **스와이프 실행**: `POST /api/swipes/users/{fromUserId}`
- **스와이프 여부 확인**: `GET /api/swipes/users/{fromUserId}/check/{toUserId}`
- **좋아요 토글**: `POST /api/swipes/like/{fromUserId}/{toUserId}`
- **좋아요 상태 확인**: `GET /api/swipes/like-status/{fromUserId}/{toUserId}`

## 매칭 관리
- **사용자 매칭 목록 조회**: `GET /api/matches/users/{userId}`
- **매칭 상태 변경**: `PUT /api/matches/{matchId}/status?status=INACTIVE`
- **활성 매칭 목록 조회**: `GET /api/matches/users/{userId}/active`

## 홈화면
- **사용자 프로필 조회 (홈용)**: `GET /api/home/profile/{userId}`
- **사용자 프로필 수정 (홈용)**: `PUT /api/home/profile/{userId}`
- **사용자 랭킹 조회**: `GET /api/home/ranking?page=0&size=10`
- **지역별 강아지 TOP 3**: `GET /api/home/regional-dogs/{city}?limit=3`
- **전체 강아지 랭킹**: `GET /api/home/dog-ranking?page=0&size=10`
- **특정 사용자 상세 정보**: `GET /api/home/user/{userId}`
## 실시간 채팅
- **채팅 기록 조회**: `GET /api/chat/{chatroomId}/history?userId={userId}`
- **읽지 않은 메세지 수 조회**: `GET /api/chat/{chatroomId}/unread-count?userId={userId}`
- **메시지 읽음 처리**: `PUT /api/chat/{chatroomId}/read?userId={userId}`
- **채팅방 생성**: `POST /api/chat/room/match/{matchId}`
- **매치 기반 채팅방 조회**: `GET /api/chat/room/match/{matchId}`

## 추가기능
- **소셜 로그인**: `POST /auth/social-login`
