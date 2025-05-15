/* library import */
import { useState, useEffect } from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { createGlobalStyle } from "styled-components"
import reset from "styled-reset"
import { auth } from "./firebase"
import styled from "styled-components"
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


/* router Layout */
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
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
])


/* App 컴포넌트 */
function App() {
  // 로딩 상태
  const [isLoading, setLoading] = useState(true);

  // 앱 초기화
  const init = async () => {
    // wait for firebase
    await auth.authStateReady();
    setLoading(false);
  }

  // 처음 시작할 때 파이어베이스를 셋팅하고, 파이어베이스 셋팅 후 로딩 상태를 끝내기
  useEffect(() => {
    init();
  }, [])

  // render
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
