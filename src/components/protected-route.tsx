import { Navigate } from "react-router-dom"
import { auth } from "../firebase"

export default function ProtectedRoute(
  { children }: { children: React.ReactNode; }) {
  const user = auth.currentUser;      // login 여부 return 

  if (user === null) {                 // 만약 로그인 상태가 아니면
    return <Navigate to="/login" />   // 모든 접근을 /login 페이지로
  }

  return children                     // 로그인 상태이면 children를 렌더
}
