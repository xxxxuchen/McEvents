import React, { useState, useEffect } from "react";
import EventCard from "../../components/EventCard.jsx";
import "./style.css"; // Import the CSS file
import customFetch from "../../utils/customFetch.js";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Pagination } from "antd";

const EventDashboard = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [formData, setFormData] = useState({
    keyword: "",
    registered: false,
    organization: "",
  });

  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Fetch all events on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await customFetch("/events");
      setEvents(data.events);
      setFilteredEvents(data.events);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Handle input changes for the search bar, checkbox, and select
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Apply filters based on formData
  const handleFilter = async (e) => {
    e.preventDefault();

    // Construct query parameters
    const params = new URLSearchParams();

    if (formData.keyword.trim() !== "") {
      params.append("keyword", formData.keyword.trim());
    }

    params.append("registered", formData.registered); //always send a myRegisteredEvents, default to be false

    if (formData.organization !== "") {
      params.append("organization", formData.organization);
    }

    const queryString = params.toString();
    const endPoint = "/events";
    const urlWithParams = queryString ? `${endPoint}?${queryString}` : endPoint;

    try {
      const data = await customFetch(urlWithParams);
      setFilteredEvents(data.events);
      setCurrentPage(1);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleReset = async () => {
    setFormData({
      keyword: "",
      registered: false,
      organization: "",
    });

    // Fetch all events without filters
    try {
      const data = await customFetch("/events");
      setFilteredEvents(data.events);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleCardClick = (eventId) => {
    // Navigate to the event details page using relative path
    // currently at /app/events, navigate(eventId) will go to /app/events/:id
    navigate(eventId);
  };

  // Calculate the sliced events for the current page
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedEvents = filteredEvents.slice(startIndex, endIndex);

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-hero">
        <h1 className="dashboard-title">Explore Events at McGill</h1>
        <p className="dashboard-subtitle">
          Discover upcoming events tailored for you. Search and filter to find
          your next experience!
        </p>
      </div>

      <form className="filter-form" onSubmit={handleFilter}>
        <input
          type="text"
          name="keyword"
          placeholder="Search by keyword..."
          value={formData.keyword}
          onChange={handleInputChange}
          className="filter-input"
        />
        <label className="filter-checkbox-label">
          <input
            type="checkbox"
            name="registered"
            checked={formData.registered}
            onChange={handleInputChange}
            className="filter-checkbox"
          />
          My Registered Events
        </label>

        <label htmlFor="organization">organization:</label>
        <br />
        <select
          id="organization"
          value={formData.organization}
          onChange={handleInputChange}
          name="organization"
          className="form-input select-input"
        >
          <option value="" disabled>Select organization</option>
          <option value="personal">personal</option>
          <option value="department">department</option>
          <option value="club">club</option>
        </select>
        <br />
        <button type="submit" className="btn">
          Apply Filters
        </button>
        <button type="button" className="btn-secondary" onClick={handleReset}>
          Reset Filters
        </button>
      </form>

      <div className="events-grid">
        {paginatedEvents.map((event) => (
          <EventCard
            key={event._id}
            event={event}
            onClick={() => {
              handleCardClick(event._id);
            }}
          />
        ))}
      </div>

      <div className="pagination-container">
        <Pagination
          align="end"
          current={currentPage}
          pageSize={pageSize}
          total={filteredEvents.length}
          onChange={handlePageChange}
          showQuickJumper
          showSizeChanger={false}
        />
      </div>
    </div>
  );
};

export default EventDashboard;
