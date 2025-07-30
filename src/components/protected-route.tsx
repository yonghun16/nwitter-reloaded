import { Navigate } from "react-router-dom"
import { User } from "firebase/auth"

export default function ProtectedRoute({
  children,
  user,
  isLoading,
}: {
  children: React.ReactNode;
  user: User | null;
  isLoading: boolean;
}) {
  if (isLoading) return null; // 또는 <LoadingScreen />
  if (!user) return <Navigate to="/login" />;
  return children;
}
