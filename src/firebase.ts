import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD9i9eUrtolWAgmDsh0OjzyKRbm8m1O1eM",
  authDomain: "nwitter-reloaded-95320.firebaseapp.com",
  projectId: "nwitter-reloaded-95320",
  storageBucket: "nwitter-reloaded-95320.firebasestorage.app",
  messagingSenderId: "356178270482",
  appId: "1:356178270482:web:6aafaef9f1de9d50b3bbcb"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
