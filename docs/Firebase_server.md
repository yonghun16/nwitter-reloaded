# Firebase Server

### Firebase Server (Firebase 백엔드)
- Firebase SDK와 Firebase Server(정확히 말하면 “Firebase의 백엔드 인프라”)는 Firebase의 역할이 서로 다른 두 구성요소입니다.

### Firebase SDK VS firebase Server

| 구분       | Firebase SDK                                           | Firebase Server (Firebase 백엔드)                           |
|------------|--------------------------------------------------------|-------------------------------------------------------------|
| 🔧 정의    | 클라이언트(또는 서버) 앱에서 Firebase 기능을 사용할 수 있게 해주는 도구/라이브러리 | Google이 제공하는 실제 서버 및 클라우드 기반 서비스 인프라 |
| 📦 구성    | 자바스크립트, iOS, Android, Node.js 등용 SDK            | 인증 서버, 데이터베이스 서버, 호스팅 서버, 함수 실행 서버 등 |
| 🎯 목적    | 앱에서 Firebase 기능을 호출하거나 사용할 수 있도록 해줌 | 클라이언트가 요청하면 실제로 처리하는 서버 쪽               |
| 👨‍💻 예시    | `firebase.auth().signInWithEmailAndPassword()`         | 이메일/비밀번호를 실제로 확인하고, 토큰을 발급함            |
| 🧠 위치    | 클라이언트 앱(Android, iOS, 웹 등) 또는 Node.js 서버 코드 내부 | Google Cloud 내 서버에서 동작 (보이지 않음)              |



### 예시 1: 사용자 로그인

#### 📱 클라이언트 측 (Firebase SDK 사용)
```js
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const auth = getAuth();
signInWithEmailAndPassword(auth, "user@example.com", "password123");
```

#### ⚙️ Firebase Server에서 처리되는 일
- auth 서버가 요청 수신
- user@example.com이 실제 존재하는지 확인
- 비밀번호 암호화 비교
- 성공하면 Firebase Server가 JWT 인증 토큰을 생성해서 클라이언트에 반환
- 실패 시 적절한 에러 메시지 전송



### 예시 2 : 데이터 저장(Firestore)

#### 📱 클라이언트 측 (Firebase SDK 사용)
```js
import { getFirestore, doc, setDoc } from "firebase/firestore";

const db = getFirestore();
await setDoc(doc(db, "users", "alice"), {
  age: 25,
  role: "admin"
});
```

#### ⚙️ Firebase Server에서 처리되는 일
- Firestore 서버가 요청을 받음
- 인증된 사용자인지 확인 (보안 규칙 적용)
- 해당 위치(users/alice)에 데이터를 저장
- 성공 응답을 클라이언트로 전송



### 예시 3: 사용자 가입 이벤트 트리거

#### 📱 클라이언트에서 새 사용자 가입 시
```js
createUserWithEmailAndPassword(auth, "newuser@example.com", "securePass!");
```

#### ⚙️ Firebase Server에서 처리되는 일
- 인증 서버가 사용자 생성
- 보안 규칙에 따라 사용자 정보 저장
- Cloud Function 트리거 (예: onCreate) 감지
- 서버 코드 실행 → 이메일 보내기, DB 기록, Slack 알림 등
