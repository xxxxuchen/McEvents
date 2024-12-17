const express = require("express");
const {
  getEvents,
  getEventDetails,
  getRegistrationDetailsByEventId,
} = require("../controllers/events");
const checkAuth = require("../middleware/checkAuth");
const router = express.Router();

router.get("/", getEvents);
router.get("/:id", checkAuth, getEventDetails);
router.get(
  "/registration/:eventID",
  checkAuth,
  getRegistrationDetailsByEventId
);

module.exports = router;
