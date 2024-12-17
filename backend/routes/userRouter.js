const express = require("express");
const fileUpload = require("express-fileupload");
const {
  userPublishEvent,
  getUserPublishedEvents,
  uploadImage,
  userUpdateEvent,
  userDeleteEvent,
  userUpdateSelf,
  getUserRegisteredEvents,
  userRegisterEvent,
  userCancelRegistration,
} = require("../controllers/user");

const router = express.Router();

router.use(fileUpload());

// user
router.put("/update-self", userUpdateSelf);
router.post("/uploads", uploadImage);

// user events registration
router.get("/events/registered", getUserRegisteredEvents);
router.delete("/events/cancel/:id", userCancelRegistration);
router.post("/events/register/:id", userRegisterEvent);

// user events publishing
router.post("/events", userPublishEvent);
router.post("/events/:id", userUpdateEvent);
router.delete("/events/:id", userDeleteEvent);
router.get("/events", getUserPublishedEvents);

module.exports = router;
