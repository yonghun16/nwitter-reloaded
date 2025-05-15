/* firebase module import */
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

/* firebase config */
const firebaseConfig = {
  apiKey: "AIzaSyD9i9eUrtolWAgmDsh0OjzyKRbm8m1O1eM",
  authDomain: "nwitter-reloaded-95320.firebaseapp.com",
  projectId: "nwitter-reloaded-95320",
  storageBucket: "nwitter-reloaded-95320.firebasestorage.app",
  messagingSenderId: "356178270482",
  appId: "1:356178270482:web:6aafaef9f1de9d50b3bbcb"
};

const app = initializeApp(firebaseConfig);    // firebase App 초기화

export const auth = getAuth(app);             // Firebase 인증 기능을 사용할 수 있는 객체(auth)를 생성하여 외부에서 사용할 수 있도록 export
                                              // 로그인, 로그아웃, 회원가입 등에 사용

// export const storage = app.storage();      // 유료 서비스인 관계로 사용하지 않음.

export const db = getFirestore(app);          // Firestore를 사용할 수 있도록 설정한 객체
