import { useState, useEffect } from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { createGlobalStyle } from "styled-components"
import reset from "styled-reset"

// components
import Layout from "./components/layout"
import LoadingScreen from "./components/loading-screen"

// routes
import Home from "./routes/home"
import Profile from "./routes/profile"
import Login from "./routes/login"
import CreateAccount from "./routes/create-account"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
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

// Global styles
const GlobalStyles = createGlobalStyle`
  ${reset}
  body {
    background-color: black;
    color: white;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
`;

function App() {
  const [isLoading, setLoading] = useState(true);

  const init = async () => {
    // wait for firebase
    setLoading(false);
  }

  useEffect(() => {
    init();
  }, [])

  return (
    <>
      <GlobalStyles />
      {isLoading ? <LoadingScreen /> : <RouterProvider router={router} />}
    </>
  )
}

export default App
