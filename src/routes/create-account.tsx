import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { FirebaseError } from "firebase/app";
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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // handler
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { target: { name, value } } = event;
    if (name === "name") {
      setName(value);
    } else if (name === "email") {
      setEmail(value);
    }
    else if (name === "password") {
      setPassword(value);
    }
  }

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if(isLoading || name === "" || email === "" || password === "") {
      return;
    }

    try {
      setLoading(true);
      const credentials = await createUserWithEmailAndPassword(    // 사용자 email 계정 등록
        auth, 
        email, 
        password
      );
      //console.log("credentials", credentials.user);
      await updateProfile(credentials.user, {    // 사용자 계정 이름 받아오기
        displayName: name
      });
      navigate("/");
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

      <Title>Join 𝕏</Title>

      <Form onSubmit={onSubmit}>
        <Input
          onChange={onChange}
          name="name"
          value={name}
          placeholder="Name"
          type="text" />
        <Input
          onChange={onChange}
          name="email"
          value={email}
          placeholder="Email"
          type="email" />
        <Input
          onChange={onChange}
          name="password"
          value={password}
          placeholder="Password"
          type="password" />
        <Input type="submit" value={isLoading ? "Loading..." : "Create Account"} />
      </Form>

      {error !== "" ? <Error>{error}</Error>: null}
      <Switcher>
        Already have an account?{" "}
        <Link to="/login">Log in</Link>
      </Switcher>
      <GithubButton />

    </Wrapper>
  )
}
