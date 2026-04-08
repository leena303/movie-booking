const express = require("express");
const router = express.Router();
const seatController = require("../controllers/seat.controller");

router.get("/showtimes/:showtimeId/seats", seatController.getSeatsByShowtime);

module.exports = router;
