import PropTypes from "prop-types";

const EventCard = ({ event, onClick }) => {
  return (
    <div style={cardStyles} onClick={onClick}>
      <img src={event.image} alt={event.title} style={imageStyles} />
      <div style={contentStyles}>
        <h3 style={titleStyles}>{event.title}</h3>
        <p style={dateStyles}>
          <strong>Date: </strong>
          {new Date(event.holdingDate).toLocaleString()}
        </p>
        <p style={orgStyles}>
          <strong>Organization: </strong>
          {event.organization}
        </p>
        <p style={userCountStyles}>
          <strong>Registered: </strong>
          {event.registeredUsersCount}
        </p>
      </div>
    </div>
  );
};

EventCard.propTypes = {
  event: PropTypes.shape({
    image: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    holdingDate: PropTypes.string.isRequired,
    organization: PropTypes.string.isRequired,
    registeredUsersCount: PropTypes.number.isRequired,
  }).isRequired,
  onClick: PropTypes.func,
};

// Modern, minimalistic design inspired by Dribbble
const cardStyles = {
  width: "300px",
  borderRadius: "12px",
  overflow: "hidden",
  backgroundColor: "#fff",
  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
  cursor: "pointer",
  display: "flex",
  flexDirection: "column",
};

const imageStyles = {
  width: "100%",
  height: "180px",
  objectFit: "cover",
};

const contentStyles = {
  padding: "20px",
};

const titleStyles = {
  fontSize: "20px",
  margin: "0 0 10px 0",
  color: "#333",
  fontWeight: "600",
};

const dateStyles = {
  fontSize: "14px",
  margin: "0 0 8px 0",
  color: "#666",
};

const orgStyles = {
  fontSize: "14px",
  margin: "0 0 8px 0",
  color: "#666",
};

const userCountStyles = {
  fontSize: "14px",
  margin: "0",
  color: "#666",
};

// Optional hover effect (If needed, can be placed inline or in a CSS file):
// Add this as a pseudo-class in a separate CSS file or a styled-component.
// .event-card:hover {
//   transform: translateY(-3px);
//   box-shadow: 0 6px 15px rgba(0,0,0,0.1);
// }

export default EventCard;
