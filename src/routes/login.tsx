/* library import */
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../firebase";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import GithubButton from "../components/github-btn";
// styled components
import { Error, Form, Input, Switcher, Title, Wrapper } from "../components/auth-components";


/* Login components */
export default function CreateAccount() {
  // states
  const [isLoading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // onChange handler
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { target: { name, value } } = event;
    if (name === "email") {
      setEmail(value);
    }
    else if (name === "password") {
      setPassword(value);
    }
  }

  // onSubmit handler
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (isLoading || email === "" || password === "") {
      return;
    }

    try {                                                         // Login 시도
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);    // 로그인 처리 
      navigate("/");                                              // 에러가 없다면 로그인 후 home으로 이동
    } catch (error) {                                             // 에러 발생시
      if (error instanceof FirebaseError) {
        setError(error.message);                                  // 에러 출력
      }
    } finally {
      setLoading(false);
    }
    //console.log(name, email, password);
  }

  // render
  return (
    <Wrapper>

      <Title>Log into 𝕏</Title>

      <Form onSubmit={onSubmit}>
        <Input
          onChange={onChange}
          name="email"
          value={email}
          placeholder="Email"
          type="email" 
          autoComplete="username"/>
        <Input
          onChange={onChange}
          name="password"
          value={password}
          placeholder="Password"
          type="password"
          autoComplete="password"/>
        <Input type="submit" value={isLoading ? "Loading..." : "Log in"} />
      </Form>

      {/* 에러 발생 시 에러 표시 */}
      {error !== "" ? <Error>{error}</Error> : null}

      <Switcher>
        Don't have an account?{" "}
        <Link to="/create-account">Sign up</Link>
      </Switcher>

      <GithubButton />

    </Wrapper>
  )
}
