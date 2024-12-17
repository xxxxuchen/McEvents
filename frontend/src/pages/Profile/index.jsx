//Louis Bouchard, 261053689
import defaultPfp from "../../assets/images/DefaultPfp.png";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import FormItem from "../../components/FormItem";
import customFetch from "../../utils/customFetch";
import { toast } from "react-toastify";
import ImageUploader from "../../components/ImageUploader";
import { useUser } from "../../contexts/UserContext";
import "./style.css";

export default function Profile() {
  const formState = {
    name: "",
    password: "",
    passwordRepeat: "",
  };
  const { user, dispatch, isLoading } = useUser();
  const [formData, setFormData] = useState(formState);
  const [hasChanged, setHasChanged] = useState(false);
  const [pfp, setPfp] = useState(user.pfpLink);
  // Page setup
  useEffect(() => {
    setFormData({ ...formData, name: user.name });
  }, []); // Runs only once
  // Function for updating form data for pfp
  async function handleImageUpload(imageSrc) {
    setFormData({ ...formData, pfpLink: imageSrc });
    setPfp(imageSrc);
    setHasChanged(true);
  }
  function ProfilePicture() {
    return (
      <div className="pfpSection">
        <div className="pfpBox">
          <ImageUploader
            rounded
            initialImage={pfp ? pfp : defaultPfp}
            onImageUpload={handleImageUpload}
          />
          <div>
            <strong style={{ fontSize: "1.5rem" }}>{user.name}</strong>
          </div>
          <div
            style={{
              fontSize: "0.8rem",
              textAlign: "center",
              wordBreak: "break-all",
            }}
          >
            {user.email}
          </div>
        </div>
        <Link to="./publishedEvents">
          <button style={{ width: "100%" }} className="btn-secondary">
            My published events
          </button>
        </Link>
        <Link to="./createEvent">
          <button style={{ width: "100%", marginTop: "10px" }} className="btn">
            Publish event
          </button>
        </Link>
      </div>
    );
  }
  function EditSection() {
    return (
      <div className="editSection">
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="saveWarning">
            {hasChanged || formData.name !== user.name || formData.password
              ? "You have unsaved changes"
              : "\u00A0"}
          </div>
          <FormItem
            type="text"
            name="name"
            value={formData.name}
            label="New name"
            onChange={handleInputsChange}
            autoComplete="new-password"
          />
          <FormItem
            type="password"
            name="password"
            value={formData.password}
            label="New password"
            onChange={handleInputsChange}
            autoComplete="new-password"
          />
          {formData.password && (
            <FormItem
              type="password"
              name="passwordRepeat"
              value={formData.passwordRepeat}
              label="Confirm new password"
              onChange={handleInputsChange}
              autoComplete="new-password"
            />
          )}
          <button
            type="submit"
            className="btn submit-btn btn-fullWidth"
            disabled={isLoading}
          >
            {isLoading ? "loading..." : "Save Profile Changes"}
          </button>
        </form>
      </div>
    );
  }
  // Changes form data has user updates it
  const handleInputsChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  // Saves changes to database
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, password, passwordRepeat } = formData;
    // No empty name
    if (!name) {
      toast.error("Name field cannot be empty");
      return;
    }
    if (password && password !== passwordRepeat) {
      toast.error("Passwords must match");
      return;
    }
    const filteredData = Object.fromEntries(
      Object.entries(formData).filter(
        ([k, v]) => v != "" && k != "passwordRepeat"
      )
    );
    if (pfp) {
      filteredData.pfpLink = pfp;
    }
    if (!hasChanged && (formData.name === user.name) && !formData.password) {
      toast.error("Nothing to change!");
      return;
    }
    const data = JSON.stringify({ ...user, ...filteredData });
    dispatch({ type: "loading" });
    try {
      const resData = await customFetch("/user/update-self", {
        method: "PUT",
        body: data,
      });
      dispatch({ type: "update/user", payload: resData.updatedUser }); // update frontend User
      setFormData({
        name: resData.updatedUser.name,
        password: "",
        passwordRepeat: "",
      });
      setHasChanged(false);
      toast.success("Successfully updated profile!")
    } catch (error) {
      toast.error(error.message);
      dispatch({ type: "cancel" });
    }
  };
  return (
    <div className="profileContainer">
      <ProfilePicture />
      <>{EditSection()}</>
    </div>
  );
}
