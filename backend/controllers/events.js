const CustomError = require("../utils/customError");
const Event = require("../models/Event");
const Registration = require("../models/Registration");
const jwt = require("jsonwebtoken");

const getEvents = async (req, res, next) => {
  const { keyword, organization, registered } = req.query;

  try {
    const query = {};

    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ];
    }

    if (organization) {
      query.organization = organization;
    }

    if (registered && registered === "true") {
      const tokenHeader = req.headers.authorization;
      if (!tokenHeader || !tokenHeader.startsWith("Bearer")) {
        next(new CustomError("Authentication invalid. User is not logged in", 401));
      }
      const token = tokenHeader.split(" ")[1];
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const userID = payload.userId;

      const registrations = await Registration.find({ user: userID }).select(
        "event"
      );
      if (registrations.length === 0) {
        return res.json({ events: [] });
      }
      console.log("registrations", registrations);
      const registeredEventIds = registrations.map(
        (registration) => registration.event
      );
      query._id = { $in: registeredEventIds };
    }

    const events = await Event.find(query)
      .populate("createdBy", "name email")
      .select("-__v")
      .sort({ holdingDate: -1 });

    // Attach registration counts to each event
    const eventIds = events.map((event) => event._id);
    const registrationCounts = await Registration.aggregate([
      { $match: { event: { $in: eventIds } } },
      { $group: { _id: "$event", count: { $sum: 1 } } },
    ]);

    const registrationCountMap = registrationCounts.reduce((acc, curr) => {
      acc[curr._id.toString()] = curr.count;
      return acc;
    }, {});

    const eventsWithCounts = events.map((event) => ({
      ...event.toObject(),
      registeredUsersCount: registrationCountMap[event._id.toString()] || 0,
    }));

    res.json({ events: eventsWithCounts });
  } catch (error) {
    next(new CustomError("Error fetching events", 500));
  }
};

const getEventDetails = async (req, res, next) => {
  const { id: evId } = req.params; // Extract evId from the URL
  try {
    const event = await Event.findById(evId)
      .populate("createdBy", "name email pfpLink")
      .select("-__v")
      .sort({ createdAt: -1 });
    if (!event) {
      return next(new CustomError("Event not found", 404));
    }
    res.json({ event });
  } catch (error) {
    next(new CustomError("Error fetching event", 500));
  }
};

// get the registered users' details with their registration info for a specific event
const getRegistrationDetailsByEventId = async (req, res, next) => {
  const { eventID } = req.params;

  try {
    const registrations = await Registration.find({ event: eventID })
      .populate({
        path: "user",
        select: "name email",
      })
      .select(
        "participationName faculty major phone McGillID comment createdAt"
      );

    if (registrations.length === 0) {
      return res.status(200).json({ registrationDetails: [] });
    }

    const registrationDetails = registrations.map((registration) => ({
      user: registration.user,
      registrationInfo: {
        participationName: registration.participationName,
        faculty: registration.faculty,
        major: registration.major,
        comment: registration.comment,
        phone: registration.phone,
        McGillID: registration.McGillID,
        registeredAt: registration.createdAt,
      },
    }));

    res.status(200).json({ registrationDetails });
  } catch (error) {
    next(new CustomError("Error fetching registration details", 500));
  }
};

module.exports = {
  getEvents,
  getEventDetails,
  getRegistrationDetailsByEventId,
};
