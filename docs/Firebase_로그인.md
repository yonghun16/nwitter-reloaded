# Firebase 로그인

### signInWithEmailAndPassword()
- Firebase Authentication에서 제공하는 함수로, 이메일과 비밀번호를 사용한 로그인 기능을 제공.
- 사용자가 이미 Firebase Authentication에 등록되어 있어야 하며, 해당 이메일/비밀번호 조합이 유효할 때 로그인이 성공 

#### 기본 사용법
- 매개변수
  - auth: getAuth()를 통해 가져온 Firebase 인증 인스턴스
  - email: 로그인하려는 사용자의 이메일 주소 (string)
  - password: 해당 사용자의 비밀번호 (string)
- 반환값
  - 성공 시: Promise\<UserCredential> 객체를 반환
    - → userCredential.user에 로그인한 사용자 정보가 들어 있음
  -실패 시: Promise가 reject되며 FirebaseError를 반환
    - → error.code로 오류 종류 확인 가능
```js
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const auth = getAuth();
signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // 로그인 성공
    const user = userCredential.user;
    console.log("로그인 성공:", user);
  })
  .catch((error) => {
    // 로그인 실패
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error("로그인 실패:", errorCode, errorMessage);
  });
```


### signInWithPopup()
- signInWithPopup()은 Firebase Authentication에서 제공하는 메서드로, 팝업 창을 통해 소셜 로그인(예: Google, Facebook, GitHub 등)을 할 수 있도록 해줍니다. 클라이언트(웹 브라우저) 기반에서 사용되며, 사용자가 소셜 로그인을 시도할 때 팝업 창이 열리고, 인증이 완료되면 사용자의 정보가 반환됩니다.

#### 기본 사용법
```js
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const auth = getAuth();
const provider = new GoogleAuthProvider();

signInWithPopup(auth, provider)
  .then((result) => {
    // 로그인 성공
    const user = result.user;
    console.log("User Info:", user);
    
    // 액세스 토큰 (선택적)
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
  })
  .catch((error) => {
    // 로그인 실패
    console.error(error.code, error.message);
  });
```
