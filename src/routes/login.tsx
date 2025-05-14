import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link } from "react-router-dom";
import GithubButton from "../components/github-btn";
import {
  Error,
  Form,
  Input,
  Switcher,
  Title,
  Wrapper,
} from "../components/auth-components";


export default function CreateAccount() {
  // state
  const [isLoading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // handler
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { target: { name, value } } = event;
    if (name === "email") {
      setEmail(value);
    }
    else if (name === "password") {
      setPassword(value);
    }
  }

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (isLoading || email === "" || password === "") {
      return;
    }

    try {  // Login 시도
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);  // 로그인 처리
      navigate("/");    // 에러가 없다면, 
    } catch (error) {
      if (error instanceof FirebaseError) {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
    //console.log(name, email, password);
  }

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

      {error !== "" ? <Error>{error}</Error> : null}
      <Switcher>
        Don't have an account?{" "}
        <Link to="/create-account">Sign up</Link>
      </Switcher>
      <GithubButton />
    </Wrapper>
  )
}
