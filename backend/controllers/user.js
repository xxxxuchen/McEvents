const User = require("../models/User.js");
const Event = require("../models/Event.js");
const Registration = require("../models/Registration.js");
const CustomError = require("../utils/customError.js");
const path = require("path");
const bcrypt = require("bcryptjs");

const getUserRegisteredEvents = async (req, res, next) => {
  const userID = req.userID;

  try {
    // populate the event details for each registration first
    const registrations = await Registration.find({ user: userID })
      .populate({
        path: "event",
        populate: { path: "createdBy", select: "name email" },
      })
      .select(
        "event participationName faculty major phone McGillID comment createdAt"
      );

    if (!registrations.length) {
      return res.status(200).json({ registeredEvents: [] });
    }

    const registeredEvents = registrations.map((registration) => ({
      eventDetails: registration.event.toObject(),
      registrationDetails: {
        participationName: registration.participationName,
        faculty: registration.faculty,
        major: registration.major,
        phone: registration.phone,
        McGillID: registration.McGillID,
        comment: registration.comment,
        registeredAt: registration.createdAt,
      },
    }));

    res.status(200).json({ registeredEvents });
  } catch (error) {
    next(new CustomError("Error fetching registered events", 500));
  }
};

const userRegisterEvent = async (req, res, next) => {
  const userID = req.userID;
  const eventID = req.params.id;
  try {
    const event = await Event.findById(eventID);
    if (!event) {
      return next(new CustomError("Event not found", 404));
    }

    // check if the user has already registered for this event
    const existingRegistration = await Registration.findOne({
      user: userID,
      event: eventID,
    });
    if (existingRegistration) {
      return next(
        new CustomError("You have already registered for this event", 400)
      );
    }

    const registration = await Registration.create({
      user: userID,
      event: eventID,
      ...req.body,
    });
    res.status(201).json({ registration });
  } catch (error) {
    next(error);
  }
};

const getUserPublishedEvents = async (req, res, next) => {
  const userID = req.userID;
  try {
    const user = await User.findById(userID)
      .select("publishedEvents")
      .populate({
        path: "publishedEvents",
        options: { sort: { createdAt: -1 } }, // Sort by createdAt in ascending order (oldest to latest)
      });
    if (!user) {
      return next(new CustomError("User not found", 404));
    }
    res.status(200).json({ publishedEvents: user.publishedEvents });
  } catch (error) {
    next(error);
  }
};

const userPublishEvent = async (req, res, next) => {
  const userID = req.userID;
  req.body.createdBy = userID;
  const event = await Event.create(req.body);
  // Add this event to the user's publishedEvents list
  await User.findByIdAndUpdate(userID, {
    $push: { publishedEvents: event._id },
  });
  res.status(201).json({ event });
};

const userUpdateEvent = async (req, res, next) => {
  const userID = req.userID;
  req.body.createdBy = userID;
  const eventID = req.params.id;
  try {
    const event = await Event.findById(eventID);
    if (!event) {
      return next(new CustomError("Event not found", 404));
    }

    const updatedEvent = await Event.findByIdAndUpdate(eventID, req.body, {
      new: true,
      runValidators: true,
    });
    res
      .status(200)
      .json({ message: "Event updated successfully", updatedEvent });
  } catch (error) {
    next(error);
  }
};

const userDeleteEvent = async (req, res, next) => {
  const userID = req.userID;
  const eventID = req.params.id;
  try {
    const event = await Event.findByIdAndDelete(eventID);
    if (!event) {
      return next(new CustomError("Event not found", 404));
    }
    await User.findByIdAndUpdate(userID, {
      $pull: { publishedEvents: eventID },
    });
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const userCancelRegistration = async (req, res, next) => {
  const userID = req.userID;
  const eventID = req.params.id;
  try {
    const count = await Registration.deleteMany({
      user:userID,
      event:eventID,
    });
    if (count === 0) {
      return next(new CustomError("Event not found", 404));
    }
    res.status(200).json({ message: "Cancelation successful" });
  } catch (error) {
    next(error);
  }
};

const uploadImage = async (req, res, next) => {
  if (!req.files) {
    return next(new CustomError("'No File Uploaded", 400));
  }
  const uploadImg = req.files.image;

  const imagePath = path.join(
    __dirname,
    "../../backend/public/uploads/" + `${uploadImg.name}`
  );
  await uploadImg.mv(imagePath);
  return res
    .status(200)
    .json({ imageSrc: `/uploads/${uploadImg.name}` });
};

const userUpdateSelf = async (req, res, next) => {
  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;
  }
  const userID = req.userID;
  try {
    // Get user
    const user = await User.findById(userID);
    if (!user) {
      return next(new CustomError("User not found", 404));
    }
    // Append updates to user
    const updatedUserData = { ...user.toObject(), ...req.body };
    const updatedUser = await User.findByIdAndUpdate(userID, updatedUserData, {
      new: true,
      runValidators: true,
    });
    const token = updatedUser.createJWT();
    res.status(200).json({
      message: "User updated successfully",
      updatedUser: {
        name: updatedUser.name,
        email: updatedUser.email,
        pfpLink: updatedUser.pfpLink || "",
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  userPublishEvent,
  getUserPublishedEvents,
  uploadImage,
  userUpdateEvent,
  userDeleteEvent,
  userCancelRegistration,
  userUpdateSelf,
  getUserRegisteredEvents,
  userRegisterEvent,
};
