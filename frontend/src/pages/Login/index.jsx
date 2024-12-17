/**
 * Created by Barry Chen
 * 260952566
 */
import { toast } from "react-toastify";
import LoginForm from "../../components/LoginForm";
import { useUser } from "../../contexts/UserContext";
import "./style.css";
import customFetch from "../../utils/customFetch";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const { user, isLoading, dispatch } = useUser();

  useEffect(() => {
    if (user) {
      navigate("/app/events");
    }
  }, [user, navigate]);

  const login = async (user) => {
    try {
      dispatch({ type: "loading" });
      const data = await customFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify(user),
      });
      dispatch({ type: "auth/login", payload: data.user });
    } catch (error) {
      toast.error(error.message);
      dispatch({ type: "error" });
    }
  };

  const register = async (user) => {
    try {
      dispatch({ type: "loading" });
      const data = await customFetch("/auth/signup", {
        method: "POST",
        body: JSON.stringify(user),
      });
      dispatch({ type: "auth/register", payload: data.user });
    } catch (error) {
      toast.error(error.message);
      dispatch({ type: "error" });
    }
  };

  return (
    <div className="login-container">
      <LoginForm isLoading={isLoading} login={login} register={register} />
    </div>
  );
}
