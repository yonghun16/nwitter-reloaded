# Firebase SDK

```bash
npm install firebase
```

### Firebase SDK
- Firebase SDK는 Google의 Firebase 플랫폼을 사용하기 위한 소프트웨어 개발 도구 모음입니다.
- SDK는 특정 플랫폼이나 서비스와 통합하거나 상호작용하기 위해 제공되는 코드, 라이브러리, 도구, 문서 등을 포함합니다.


### Firebase SDK로 할 수 있는 것들

#### 1.	Authentication (인증)
- 이메일/비밀번호, 구글/페이스북 로그인, 익명 로그인 등을 손쉽게 구현할 수 있게 해줍니다.

#### 2.	Cloud Firestore / Realtime Database
- 실시간 데이터베이스를 사용해서 실시간 동기화가 필요한 앱을 만들 수 있습니다.

#### 3.	Cloud Storage
- 사용자 파일(이미지, 동영상 등)을 업로드하고 관리할 수 있습니다.

#### 4.	Firebase Hosting
- 정적 웹사이트를 빠르고 간단하게 배포할 수 있습니다.

#### 5.	Cloud Functions
- 백엔드 서버 없이도 클라우드에서 코드를 실행할 수 있습니다 (서버리스 함수).

#### 6.	Analytics, Crashlytics, Performance Monitoring 등
- 앱의 사용 통계나 오류 추적, 성능 개선 등을 지원합니다.


## 인증 관련 함수

### 1. auth.authStateReady()
- auth.authStateReady()는 **Firebase Auth SDK (v10 이상, Modular 버전)**에서 제공하는 메서드로,
현재 사용자의 인증 상태가 로드될 때까지 기다리는 비동기 함수. 
- 반환값 : Promise → resolve되면 auth.currentUser가 확정된 상태

