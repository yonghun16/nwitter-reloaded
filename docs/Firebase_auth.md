### firbase 인증에 대한 코드 예제 (Vanilla JS + Firebase Modular SDK)


#### firbase.js
```js
// firebase.js
import { initializeApp } from "firebase/app";    // Firebase.initializeApp
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-app",
  appId: "YOUR_APP_ID"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// 회원가입 함수
export async function signUp(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("회원가입 성공:", userCredential.user);
  } catch (error) {
    console.error("회원가입 실패:", error.message);
  }
}

// 로그인 함수
export async function login(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("로그인 성공:", userCredential.user);
  } catch (error) {
    console.error("로그인 실패:", error.message);
  }
}

// 로그아웃 함수
export async function logout() {
  try {
    await signOut(auth);
    console.log("로그아웃 성공");
  } catch (error) {
    console.error("로그아웃 실패:", error.message);
  }
}
```
#### loginForm.js
```js
// loginForm.js
import { signUp, login, logout } from "./firebase.js";       // 인증 관련 함수 import

// 회원가입
document.getElementById("signup-btn").addEventListener("click", () => {
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;
  signUp(email, password);
});

// 로그인
document.getElementById("login-btn").addEventListener("click", () => {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  login(email, password);
});

// 로그아웃
document.getElementById("logout-btn").addEventListener("click", () => {
  logout();
});
```
#### html
```html
<input type="email" id="signup-email" placeholder="이메일" />
<input type="password" id="signup-password" placeholder="비밀번호" />
<button id="signup-btn">회원가입</button>

<br/><br/>

<input type="email" id="login-email" placeholder="이메일" />
<input type="password" id="login-password" placeholder="비밀번호" />
<button id="login-btn">로그인</button>

<br/><br/>

<button id="logout-btn">로그아웃</button>
```

### updateProfile()
- firebase/auth의 updateProfile() 함수는 현재 로그인한 사용자의 프로필 정보를 업데이트할 때 사용되는 Firebase Authentication 함수입니다. 주로 사용자 이름(표시 이름)과 프로필 사진 URL을 수정할 때 사용됩니다.

#### 파라미터
- user: 업데이트할 사용자 객체 (auth.currentUser로 가져올 수 있음)
- profile: 업데이트할 정보가 담긴 객체
  - displayName (문자열): 사용자 표시 이름
  - photoURL (문자열): 프로필 사진의 URL
```js
import { getAuth, updateProfile } from "firebase/auth";

const auth = getAuth();
const user = auth.currentUser;

updateProfile(user, {
  displayName: "새로운 이름",
  photoURL: "https://example.com/photo.jpg"
}).then(() => {
  console.log("프로필 업데이트 성공");
}).catch((error) => {
  console.error("프로필 업데이트 실패:", error);
});
```
