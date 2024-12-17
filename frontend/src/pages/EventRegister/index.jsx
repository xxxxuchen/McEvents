import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import customFetch from "../../utils/customFetch";
import { useParams } from "react-router-dom";
import "./style.css";
import { Link } from "react-router-dom";
import RegistrationForm from "../../components/RegistrationForm";

export default function RegisterEvent() {
  const [event, setEvent] = useState({});
  const [eventTime, setEventTime] = useState("");
  const [eventDate, setEventDate] = useState("");
  const { id: evId } = useParams();

  useEffect(() => {
    getEvent();
  }, []);
  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const timeFormatter = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  async function getEvent() {
    try {
      const resData = await customFetch("/events/" + evId);
      setEvent(resData.event);
      let time = new Date(resData.event.holdingDate);
      let formattedDate = dateFormatter.format(time);
      let formattedTime = timeFormatter.format(time);
      setEventDate(formattedDate);
      setEventTime(formattedTime);
    } catch (error) {
      toast.error(error.message);
    }
  }

  function InfoSection() {
    return (
      <div className="info-section">
        <h2>Location</h2>
        <div className="infoText">{event.venue}</div>
        <h2>Time</h2>
        <div className="infoText">
          {eventDate}
          <br />
          {eventTime}
        </div>
        <h2>Admission fee</h2>
        <div className="infoText">
          {event.price === 0 ? "FREE" : event.price + "$"}
        </div>
      </div>
    );
  }

    async function register(registration) {
        try {
            const response = await customFetch("/user/events/register/" + event._id, {
                method: "POST",
                body: JSON.stringify(registration),
            });
            toast.success("Successfully registered for " + event.title);
        } catch (error) {
            toast.error(error.message);
        }
        leavePage();
    }

  function leavePage() {
    document.getElementById("goToEventBtn").click();
  }

  return (
    <>
      <div className="pageContainer">
        <RegistrationForm
          onSubmit={register}
          eventTitle={event.title}
          leavePage={leavePage}
        />
        <InfoSection />
      </div>
      <Link to={"../events/" + event._id}>
        <button id="goToEventBtn" hidden={true}></button>
      </Link>
    </>
  );
}
