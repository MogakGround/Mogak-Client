# Mogak Hooks 구조

이 디렉토리는 모각코 애플리케이션의 OpenVidu 관련 훅들을 포함합니다.

## 훅 구조

### 1. `useHandleController.ts`

**역할**: OpenVidu 세션의 기본적인 연결과 관리

- 세션 생성 및 연결
- 구독자(subscriber) 관리
- 토큰 생성 및 관리
- 연결 상태 관리
- 에러 처리
- `/api/openvidu/sessions`, `/api/openvidu/tokens` API 라우트를 호출하여 세션 생성/토큰 발급

**주요 기능**:

- `joinSession()`: 세션 참가
- `leaveSession()`: 세션 나가기
- `connectSession()`: 세션 연결
- `subscribers`: 다른 참가자들의 스트림 관리

### 2. `useScreenShare.ts`

**역할**: 화면 공유 기능 전담

- 화면 공유 시작/중지
- 화면 공유 권한 관리
- 화면 공유 상태 추적

**주요 기능**:

- `startScreenShare()`: 화면 공유 시작
- `stopScreenShare()`: 화면 공유 중지
- `isScreenSharing`: 화면 공유 상태 확인

### 3. `useVideoController.ts`

**역할**: 비디오 스트림 제어

- 카메라 켜기/끄기
- 비디오 스트림 관리

**주요 기능**:

- `toggleVideo()`: 비디오 켜기/끄기
- `startVideo()`: 비디오 스트림 시작
- `stopVideo()`: 비디오 스트림 중지

### 4. `useOpenViduSession.tsx`

**역할**: 모든 OpenVidu 관련 훅들을 통합하는 메인 훅

- 위의 모든 훅들을 조합하여 완전한 OpenVidu 세션 관리
- 컴포넌트에서 사용하기 쉬운 인터페이스 제공

## 사용법

```typescript
const {
  // 기본 세션 관리
  session,
  subscribers,
  publisher,
  connectionError,
  isConnecting,
  joinSession,
  leaveSession,

  // 화면 공유
  startScreenShare,
  stopScreenShare,
  isScreenSharing,

  // 비디오 제어
  isVideoEnabled,
  toggleVideo,
  startVideo,
  stopVideo,
} = useOpenViduSession(roomId, userId)
```

## 장점

1. **관심사 분리**: 각 기능별로 훅이 분리되어 유지보수가 용이
2. **재사용성**: 각 훅을 독립적으로 사용 가능
3. **테스트 용이성**: 각 훅을 개별적으로 테스트 가능
4. **확장성**: 새로운 기능 추가 시 새로운 훅으로 쉽게 확장 가능
