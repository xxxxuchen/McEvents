/**
 * Created by Barry Chen
 * 260952566
 */
import { Navigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { toast } from "react-toastify";

export default function AuthenticatedRoute({ children }) {
  const { user } = useUser();

  if (!user) {
    toast.error("Please login first");
    return <Navigate to="/login" replace />;
  }

  return children;
}
