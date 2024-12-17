//Louis Bouchard, 261053689
import { useUser } from "../../contexts/UserContext";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import defaultPfp from "../../assets/images/DefaultPfp.png";
import customFetch from "../../utils/customFetch";
import "./style.css";

export default function EventDetails() {
  const { user, dispatch, isLoading } = useUser();
  const [eventImage, setEventImage] = useState("");
  const [organizerPfp, setOrganizerPfp] = useState("");
  const [organizerName, setOrganizerName] = useState("");
  const [organizerEmail, setOrganizerEmail] = useState("");
  const [eventName, setEventName] = useState("");
  const [eventDesc, setEventDesc] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [org, setOrg] = useState("");
  const [price, setPrice] = useState("");
  const [eventVenue, setEventVenue] = useState("");
  const [organization, setOrganization] = useState("");
  const [registered, setRegistered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const {id:evId} = useParams();
  useEffect(() => {
    // Load event on page load
    getEvent();
    // Check if user is already registered
    isRegistered();
  }, []); // Runs only once
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
  async function isRegistered() {
    try {
      const resData = await customFetch("/events/registration/" + evId);
      let len = resData.registrationDetails.length;
      for (let i = 0; i < len; i++) {
        if (resData.registrationDetails[i].user.email === user.email) {
          setRegistered(true);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  }
  async function getEvent() {
    try {
      const resData = await customFetch("/events/" + evId);
      setEventImage(resData.event.image);
      setEventName(resData.event.title);
      if (resData.event.createdBy.pfpLink) {
        setOrganizerPfp(resData.event.createdBy.pfpLink);
      }
      setOrganizerName(resData.event.createdBy.name);
      setOrganizerEmail(resData.event.createdBy.email);
      setEventName(resData.event.title);
      setEventDesc(resData.event.description);
      let time = new Date(resData.event.holdingDate);
      let formattedDate = dateFormatter.format(time);
      let formattedTime = timeFormatter.format(time);
      setEventDate(formattedDate);
      setEventTime(formattedTime);
      setOrg(resData.event.organization);
      setPrice(resData.event.price === 0 ? "FREE" : resData.event.price + "$");
      setEventVenue(resData.event.venue);
      setOrganization(resData.event.organization);
    } catch (error) {
      toast.error(error.message);
    }
  }
  function EventDesc() {
    return (
      <div className="descSection">
        <h1>{eventName}</h1>
        <br />
        <img src={eventImage} alt="Event image" className="eventImage"></img>
        <br />
        <h2>Description</h2>
        <div className="infoText" style={{wordBreak: "break-all"}}>{eventDesc}</div>
        <div style={{float: "right"}}>
          {!registered ? (
            <Link to="./register">
              <button className="btn-secondary">{"Register"}</button>
            </Link>
          ) : (
            <button className="btn-secondary" onClick={handleOpenModal}>{"Cancel registration"}</button>
          )}
        </div>
      </div>
    );
  }
  function EventInfo() {
    return (
      <div className="allInfo">
        <div className="infoSection">
          <h2>Location</h2>
          <div className="infoText">{eventVenue}</div>
          <h2>Time</h2>
          <div className="infoText">
            {eventDate}
            <br />
            {eventTime}
          </div>
          <h2>Admission fee</h2>
          <div className="infoText">{price}</div>
        </div>
        <div className="organizerBox">
          <img
            src={organizerPfp ? organizerPfp : defaultPfp}
            alt="Organizer pfp"
            className="organizerPfp"
          ></img>
          <div>
            <h4>Organized by</h4>
            <div style={{ fontSize: "1.5rem" }}>
              <strong>{organizerName}</strong>
            </div>
            <div style={{ fontSize: "1.1rem" }}>{organizerEmail}</div>
          </div>
          <div style={{ marginTop: "10px", width: "100%", fontSize: "1.1rem" }}>
            In association with:{" "}
            <strong style={{ fontSize: "1.25rem" }}>{organization}</strong>
          </div>
        </div>
      </div>
    );
  }
  function Modal({visible}) {
    return ( isVisible && (
      <div className="modal" onClick={handleModalClick}>
        <div className="modalContent">
          <h3>Are you sure you want to cancel your registration?</h3>
          <div className="modalButtonHolder">
            <button className="btn" onClick={handleCancel}>Yes, cancel it</button>
            <button className="btn-secondary" onClick={handleCloseModal} style={{marginLeft:"10px"}}>No, go back</button>
          </div>
        </div>
      </div>
      )
    )
  }
  async function handleCancel() {
    try {
      const resData = await customFetch("/user/events/cancel/"+evId, {method: "DELETE"});
      toast.success(resData.message);
      setRegistered(false);
    } catch (error) {
      toast.error(error.message);
    }
    setIsVisible(false);
  }
  function handleOpenModal() {
    setIsVisible(true);
  }
  function handleCloseModal() {
    setIsVisible(false);
  }
  function handleModalClick(e) {
    if (e.target !== e.currentTarget) {
      return;
    }
    setIsVisible(false);
  }
  return (
    <div className="pageContainer">
      <EventDesc/>
      <EventInfo/>
      <Modal visible={isVisible}/>
    </div>
  );
}
