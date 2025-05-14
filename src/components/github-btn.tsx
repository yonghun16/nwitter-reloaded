/* library import */
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { auth } from "../firebase";
import { signInWithPopup, GithubAuthProvider  } from "firebase/auth";


/* styled components */
const Button = styled.span`
  margin-top: 50px;
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


/* GithubButton Component */
export default function GithubButton() {
  const navigate = useNavigate();
  const onClick = async () => {
    try {
      const provider = new GithubAuthProvider();    // 인증제공자
      await signInWithPopup(auth, provider);        // signInWithPopup 함수는 팝업 창을 띄워서 사용자가 GitHub 계정으로 로그인 가능
      navigate("/");                                // 로그인 후 home 페이지로 이동
    } catch (error) {                               // 에러 발생시
      console.log(error);                           // 에러 출력
    }
  }

  // render - Dom으로 리턴
  return (
    <Button onClick={onClick}>
      <Logo src="/github-logo.svg" /> Connect with Github
    </Button>
  )
}
