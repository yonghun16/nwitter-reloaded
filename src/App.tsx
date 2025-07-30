/* library import */
import { useState, useEffect } from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { createGlobalStyle } from "styled-components"
import reset from "styled-reset"
import { auth } from "./firebase"
import styled from "styled-components"
import { onAuthStateChanged, getRedirectResult, User } from "firebase/auth";
/* components import */
import Layout from "./components/layout"
import LoadingScreen from "./components/loading-screen"
import ProtectedRoute from "./components/protected-route"
/* routes import */
import Home from "./routes/home"
import Profile from "./routes/profile"
import Login from "./routes/login"
import CreateAccount from "./routes/create-account"


/* Global styles 설정 */
const GlobalStyles = createGlobalStyle`
  ${reset}
  * {
    box-sizing: border-box;
  }
  body {
    background-color: black;
    color: white;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
`;

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 50px;
`;


/* App 컴포넌트 */
function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    getRedirectResult(auth).finally(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
        setLoading(false);
      });
      return () => unsubscribe();
    });
  }, []);

  // 라우터를 함수 내부에서 생성하여 user, isLoading을 동적으로 전달
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute user={user} isLoading={isLoading}>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "",
          element: <Home />,
        },
        {
          path: "profile",
          element: <Profile />,
        }
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/create-account",
      element: <CreateAccount />,
    }
  ]);

  return (
    <Wrapper>
      <GlobalStyles />
      {isLoading 
        ? <LoadingScreen /> 
        : <RouterProvider router={router} />
      }
    </Wrapper>
  )
}

export default App
