/**
 * Created by Barry Chen
 * 260952566
 */
import { useState } from "react";
import FormItem from "./FormItem";
import { toast } from "react-toastify";
import logo from "../assets/images/Logo.png";

export default function Login({ isLoading, login, register }) {
  const formState = {
    name: "",
    email: "",
    password: "",
    isRegistered: true,
  };

  const [formData, setFormData] = useState(formState);

  const handleInputsChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, password, isRegistered } = formData;
    if (!email || !password || (!isRegistered && !name)) {
      toast.error("Please fill out all fields");
      return;
    }
    isRegistered
      ? login({ email, password })
      : register({ name, email, password });
  };

  return (
    <form className="form login-form" onSubmit={handleSubmit}>
      <h2 className="form-title">McEvents</h2>
      <img src={logo} alt="logo" className="logo" />
      <h3>{formData.isRegistered ? "Login" : "Register"}</h3>
      {!formData.isRegistered && (
        <FormItem
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputsChange}
        />
      )}
      <FormItem
        type="email"
        name="email"
        value={formData["email"]}
        label="McGill Email"
        onChange={handleInputsChange}
      />
      <FormItem
        type="password"
        name="password"
        value={formData.password}
        onChange={handleInputsChange}
      />
      <button
        type="submit"
        className="btn submit-btn btn-fullWidth"
        disabled={isLoading}
      >
        {isLoading ? "loading..." : "submit"}
      </button>
      <p>
        {formData.isRegistered ? "Not a member yet?" : "Already a member?"}
        <button
          type="button"
          onClick={() => {
            setFormData({ ...formData, isRegistered: !formData.isRegistered });
          }}
          className="member-btn"
        >
          {formData.isRegistered ? "Register" : "Login"}
        </button>
      </p>
    </form>
  );
}
