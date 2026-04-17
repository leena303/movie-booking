const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin.controller");
const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");

router.use(authMiddleware, adminMiddleware);

// ================= MOVIES =================
router.get("/movies", adminController.getAllMoviesAdmin);
router.post("/movies", adminController.createMovie);
router.put("/movies/:id", adminController.updateMovie);
router.delete("/movies/:id", adminController.deleteMovie);

// ================= SHOWTIMES =================
router.get("/showtimes", adminController.getAllShowtimesAdmin);
router.post("/showtimes", adminController.createShowtime);
router.put("/showtimes/:id", adminController.updateShowtime);
router.delete("/showtimes/:id", adminController.deleteShowtime);

// ================= ROOMS =================
router.get("/rooms", adminController.getAllRooms);
router.post("/rooms", adminController.createRoom);
router.put("/rooms/:id", adminController.updateRoom);
router.delete("/rooms/:id", adminController.deleteRoom);

// ================= SEATS =================
router.get("/rooms/:roomId/seats", adminController.getSeatsByRoom);
router.post("/rooms/:roomId/seats", adminController.createSeat);
router.put("/seats/:id", adminController.updateSeat);
router.delete("/seats/:id", adminController.deleteSeat);

// ================= USERS (FIX CHÍNH Ở ĐÂY) =================
router.get("/users", adminController.getAllUsers);

// thêm mới user
router.post("/users", adminController.createUser);

// update full user
router.put("/users/:id", adminController.updateUser);

// update role riêng
router.put("/users/:id/role", adminController.updateUserRole);

router.delete("/users/:id", adminController.deleteUser);

// ================= BOOKINGS =================
router.get("/bookings", adminController.getAllBookings);
router.put("/bookings/:id/status", adminController.updateBookingStatus);

module.exports = router;
