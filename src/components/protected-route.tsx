import { Navigate } from "react-router-dom"
import { auth } from "../firebase"

/* ProtectedRoute 컴포넌트 */
// 부모 컴포넌트에서 <ProtectedRoute>...</ProtectedRoute>처럼 사용했을 때, 태그 내부의 내용이 children으로 전달.
export default function ProtectedRoute(
  { children }: { children: React.ReactNode; }) {  // children의 Type 정의 :  React.ReactNode
  const user = auth.currentUser;        // login 여부 return 

  if (user === null) {                  // 만약 로그인 상태가 아니면
    return <Navigate to="/login" />     // 모든 접근을 /login 페이지로
  }

  return children                       // 로그인 상태이면 props로 전달받은 children를 그대로 렌더
}
