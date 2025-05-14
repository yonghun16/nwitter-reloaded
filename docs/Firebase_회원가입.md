# firebase 회원가입

### createUserWithEmailAndPassword()
- reateUserWithEmailAndPassword()는 Firebase Authentication에서 제공하는 함수로, **이메일과 비밀번호를 사용하여 새로운 사용자를 생성(회원가입)**하는 기능을 합니다. 

#### 기본 사용법
- 매개변수
  - auth: Firebase 인증 객체 (보통 getAuth()로 가져옴)
  - email: 회원가입할 사용자의 이메일 주소 (string)
  - password: 회원가입할 사용자의 비밀번호 (string)
- 반환값
  - credentials: 다음과 같은 정보를 포함한 객체
    - user: 새로 생성된 사용자 정보 (예: UID, 이메일, 로그인 상태 등)
```js
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const auth = getAuth();

const onSubmit = async () => {
  try {
    const credentials = await createUserWithEmailAndPassword(auth, "test@example.com", "securePassword123");
    console.log("User created:", credentials.user);
  } catch (error) {
    console.error("Error during signup:", error.message);
  }
}
```


### updateProfile()
- updateProfile은 Firebase Authentication에서 제공하는 함수로, 이미 로그인된 사용자의 프로필 정보(예: 표시 이름, 프로필 사진 URL 등)를 업데이트할 때 사용합니다.

#### 기본 사용법
- 매개변수
  - user: 업데이트할 대상 사용자 객체 (예: auth.currentUser)
  - { displayName, photoURL }: 수정할 프로필 정보
  - displayName: 사용자 이름
  - photoURL: 프로필 사진의 URL
```js
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

const auth = getAuth();

try {
  const credentials = await createUserWithEmailAndPassword(auth, "test@example.com", "password123");
  const user = credentials.user;

  await updateProfile(user, {
    displayName: "홍길동",
    photoURL: "https://example.com/myphoto.jpg"
  });

  console.log("Profile updated:", user.displayName);
} catch (error) {
  console.error("Error:", error.message);
}
```

### error instanceof FirebaseError
- Firebase에서 발생한 에러
- Firebase에서 오는 에러는 다양한 code를 가지고 있고, 이를 통해 세부적인 에러 처리가 가능
```js
if (error instanceof FirebaseError) {
  if (error.code === "auth/email-already-in-use") {
    alert("이미 등록된 이메일입니다.");
  } else if (error.code === "auth/weak-password") {
    alert("비밀번호가 너무 약합니다.");
  } else {
    alert("기타 Firebase 오류 발생: " + error.message);
  }
}
```
