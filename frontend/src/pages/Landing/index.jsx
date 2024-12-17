import { Link } from "react-router-dom";
import Logo from "../../assets/images/Logo.png";
import LandingImg from "../../assets/images/Landing.svg";
import "./style.css";
import { useUser } from "../../contexts/UserContext";

export default function Landing() {
  const { user } = useUser();

  return (
    <>
      <div className="landing-heading">
        <img src={Logo} alt="Logo" />
        <h1>McEvents</h1>
      </div>
      <main className="landing">
        <div className="landing-content">
          <div className="landing-content-left">
            <h1>
              Find <span>Events</span> Near You
            </h1>
            <div>
              Welcome to McEvents - your all-in-one platform for event
              registration and publishing at McGill. Easily browse events
              happening around campus, join the ones that excite you, or share
              your own with the entire McGill community. From student-led
              activities to community gatherings, McEvents brings everything
              happening at McGill into one easy-to-navigate space. Discover,
              Publish, Connect and make the most of your campus life all in one
              place.
            </div>
            <div className="landing-content-link">
              <Link to="/app/events">
                <button className="btn test-btn">Find Events</button>
              </Link>

              {!user && (
                <Link to="/login">
                  <button className="btn test-btn">Login</button>
                </Link>
              )}
            </div>
          </div>
          <div className="landing-content-right">
            <img src={LandingImg} alt="Landing" />
          </div>
        </div>
      </main>
    </>
  );
}
