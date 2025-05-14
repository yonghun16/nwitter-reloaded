/* library import */
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { Link } from "react-router-dom";
import GithubButton from "../components/github-btn";
// styled components
import { Error, Form, Input, Switcher, Title, Wrapper, } from "../components/auth-components";


/* CreateAccount component (회원가입, 로그인, 소셜로그인)*/
export default function CreateAccount() {
  // states
  const [isLoading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // onChange handler
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { target: { name, value } } = event;
    if (name === "name") {
      setName(value);
    } else if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    } else if (name === "confirmPassword") {
      setConfirmPassword(value);
    }
  }

  // onSubmit handler
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    
    // 필수 입력 값 확인
    if(isLoading || name === "" || email === "" || password === "" || confirmPassword === "") {
      setError("Fill out all the fields.");
      return;
    }

    // 패스워드 확인
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // firbase 연동하여 회원가입
    try {
      setLoading(true);
      const credentials = await createUserWithEmailAndPassword(    // firbase 사용자 email 계정 등록
        auth, 
        email, 
        password
      );
      //console.log("credentials", credentials.user);             // 디벼깅용
      await updateProfile(credentials.user, {                     // 등록한 firbase 사용자 계정 이름 받아오기
        displayName: name
      });
      navigate("/");                                              // 로그인 페이지로 이동
    } catch (error) {                                             // error 발생 시 error message 출력
      if (error instanceof FirebaseError) {
        setError(error.message);
      }
    } finally {
      setLoading(false);                                          // 로딩 상태 끝내기
    }
    //console.log(name, email, password, confirmPassword);        // 디버깅용
  }

  // render
  return (
    <Wrapper>

      <Title>Join 𝕏</Title>

      {/* name, email, password, confirmPassword 입력으로 회원가입 가능 */}
      <Form onSubmit={onSubmit}>
        <Input
          onChange={onChange}
          name="name"
          value={name}
          placeholder="Name"
          type="text" 
          autoComplete="username"/>
        <Input
          onChange={onChange}
          name="email"
          value={email}
          placeholder="Email"
          type="email"
          autoComplete="username" />
        <Input
          onChange={onChange}
          name="password"
          value={password}
          placeholder="Password"
          type="password" 
          autoComplete="new-password" />
        <Input
          onChange={onChange}
          name="confirmPassword"
          value={confirmPassword}
          placeholder="Confirm Password"
          type="password"
          autoComplete="new-password" />
        <Input type="submit" value={isLoading ? "Loading..." : "Create Account"} />
      </Form>

      {/* error가 ""이 아니라면? (내용이 있다는 말이니깐)에러표시 : null  */}
      {error !== "" ? <Error>{error}</Error>: null}

      {/* 로그인 페이지로 돌아가기 */}
      <Switcher>
        Already have an account?{" "}
        <Link to="/login">Log in</Link>
      </Switcher>

      {/* Github 로그인 버튼*/}
      <GithubButton />

    </Wrapper>
  )
}
