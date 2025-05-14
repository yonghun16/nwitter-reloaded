### 🔐 Firebase 인증 흐름 전체 그림
```text
[앱 시작]
   ↓
[Firebase 초기화 (getAuth)]
   ↓
[Firebase가 로컬 토큰 또는 세션 확인]
   ↓
  ┌──────────────────────┐
  │ 로그인 상태 유지 중? │
  └──────────────────────┘
    ↓          ↓
   YES        NO
    ↓          ↓
[onAuthStateChanged → user 전달]  
         OR  
[auth.currentUser == null]

=> 이후 사용자는 로그인 또는 회원가입 필요
```

### 인증 단계별 설명
#### 1. 앱 시작 및 Firebase 초기화
```js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
```

#### 2. 현재 사용자 확인 (자동 로그인 유지 여부 체크)
```js
await auth.authStateReady();  // 로그인 여부가 확정될 때까지 기다림
console.log(auth.currentUser);
```

#### 3. 로그인/회원가입 시 처리
```js
// 회원가입
import { createUserWithEmailAndPassword } from "firebase/auth";

await createUserWithEmailAndPassword(auth, email, password);
```
```js
// 로그인
import { signInWithEmailAndPassword } from "firebase/auth";

await signInWithEmailAndPassword(auth, email, password);
```
- → 로그인 성공 시, Firebase는 JWT 토큰(Access Token) 을 발급해서 클라이언트에 저장 (로컬 또는 세션 스토리지)

#### 4. onAuthStateChanged로 인증 상태 추적 
```js
import { onAuthStateChanged } from "firebase/auth";

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("로그인된 사용자:", user.email);
  } else {
    console.log("로그아웃 상태");
  }
});
```

#### 5. 로그아웃
```js
import { signOut } from "firebase/auth";

await signOut(auth);
```
