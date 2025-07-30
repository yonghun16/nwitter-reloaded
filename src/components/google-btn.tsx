import { auth } from "../firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Button = styled.span`
  margin-top: 10px;
  background-color: white;
  font-weight: 500;
  width: 100%;
  color: black;
  padding: 10px 20px;
  border-radius: 50px;
  border: 0;
  display: flex;
  gap: 5px;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  cursor: pointer;
`;

const Logo = styled.img`
  width: 30px;
  height: 30px;
`;

export default function GoogleButton() {
  const navigate = useNavigate();
  const onClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate("/"); // 로그인 성공 시 홈으로 이동
    } catch (error) {
      alert("구글 로그인 실패: " + (error as Error).message);
    }
  };

  return (
    <Button onClick={onClick}>
      <Logo src="https://developers.google.com/identity/images/g-logo.png" alt="Google" /> Connect with Google
    </Button>
  );
} 