const AdminModel = require("../models/admin.model");

function sendError(res, error, fallbackMessage) {
  console.error(fallbackMessage, error);

  return res.status(error.status || 500).json({
    message: error.message || "Server error",
  });
}

const adminController = {
  // ================= MOVIES =================
  async getAllMoviesAdmin(req, res) {
    try {
      const data = await AdminModel.getAllMovies();
      return res.json({ message: "Get movies successfully", data });
    } catch (error) {
      return sendError(res, error, "Get movies admin error:");
    }
  },

  async createMovie(req, res) {
    try {
      const result = await AdminModel.createMovie(req.body);
      return res.status(201).json({
        message: "Create movie successfully",
        insertId: result.insertId,
      });
    } catch (error) {
      return sendError(res, error, "Create movie error:");
    }
  },

  async updateMovie(req, res) {
    try {
      await AdminModel.updateMovie(req.params.id, req.body);
      return res.json({ message: "Update movie successfully" });
    } catch (error) {
      return sendError(res, error, "Update movie error:");
    }
  },

  async deleteMovie(req, res) {
    try {
      await AdminModel.deleteMovie(req.params.id);
      return res.json({ message: "Delete movie successfully" });
    } catch (error) {
      return sendError(res, error, "Delete movie error:");
    }
  },

  // ================= SHOWTIMES =================
  async getAllShowtimesAdmin(req, res) {
    try {
      const data = await AdminModel.getAllShowtimes();
      return res.json({ message: "Get showtimes successfully", data });
    } catch (error) {
      return sendError(res, error, "Get showtimes error:");
    }
  },

  async createShowtime(req, res) {
    try {
      const { movie_id, room_id, start_time, price, subtitle } = req.body;

      if (!movie_id || !room_id || !start_time) {
        return res.status(400).json({
          message: "movie_id, room_id và start_time là bắt buộc",
        });
      }

      const result = await AdminModel.createShowtime({
        movie_id,
        room_id,
        start_time,
        price,
        subtitle,
      });

      return res.status(201).json({
        message: "Create showtime successfully",
        insertId: result.insertId,
      });
    } catch (error) {
      return sendError(res, error, "Create showtime error:");
    }
  },

  async updateShowtime(req, res) {
    try {
      const { movie_id, room_id, start_time, price, subtitle } = req.body;

      if (!movie_id || !room_id || !start_time) {
        return res.status(400).json({
          message: "movie_id, room_id và start_time là bắt buộc",
        });
      }

      await AdminModel.updateShowtime(req.params.id, {
        movie_id,
        room_id,
        start_time,
        price,
        subtitle,
      });

      return res.json({ message: "Update showtime successfully" });
    } catch (error) {
      return sendError(res, error, "Update showtime error:");
    }
  },

  async deleteShowtime(req, res) {
    try {
      await AdminModel.deleteShowtime(req.params.id);
      return res.json({ message: "Delete showtime successfully" });
    } catch (error) {
      return sendError(res, error, "Delete showtime error:");
    }
  },

  // ================= ROOMS =================
  async getAllRooms(req, res) {
    try {
      const data = await AdminModel.getAllRooms();
      return res.json({ message: "Get rooms successfully", data });
    } catch (error) {
      return sendError(res, error, "Get rooms error:");
    }
  },

  async createRoom(req, res) {
    try {
      const result = await AdminModel.createRoom(req.body);
      return res.status(201).json({
        message: "Create room successfully",
        insertId: result.insertId,
      });
    } catch (error) {
      return sendError(res, error, "Create room error:");
    }
  },

  async updateRoom(req, res) {
    try {
      await AdminModel.updateRoom(req.params.id, req.body);
      return res.json({ message: "Update room successfully" });
    } catch (error) {
      return sendError(res, error, "Update room error:");
    }
  },

  async deleteRoom(req, res) {
    try {
      await AdminModel.deleteRoom(req.params.id);
      return res.json({ message: "Delete room successfully" });
    } catch (error) {
      return sendError(res, error, "Delete room error:");
    }
  },

  // ================= SEATS =================
  async getSeatsByRoom(req, res) {
    try {
      const data = await AdminModel.getSeatsByRoom(req.params.roomId);
      return res.json({ message: "Get seats successfully", data });
    } catch (error) {
      return sendError(res, error, "Get seats error:");
    }
  },

  async createSeat(req, res) {
    try {
      const result = await AdminModel.createSeat(req.params.roomId, req.body);
      return res.status(201).json({
        message: "Create seat successfully",
        insertId: result.insertId,
      });
    } catch (error) {
      return sendError(res, error, "Create seat error:");
    }
  },

  async updateSeat(req, res) {
    try {
      await AdminModel.updateSeat(req.params.id, req.body);
      return res.json({ message: "Update seat successfully" });
    } catch (error) {
      return sendError(res, error, "Update seat error:");
    }
  },

  async deleteSeat(req, res) {
    try {
      await AdminModel.deleteSeat(req.params.id);
      return res.json({ message: "Delete seat successfully" });
    } catch (error) {
      return sendError(res, error, "Delete seat error:");
    }
  },

  // ================= USERS =================
  async getAllUsers(req, res) {
    try {
      const data = await AdminModel.getAllUsers();
      return res.json({ message: "Get users successfully", data });
    } catch (error) {
      return sendError(res, error, "Get users error:");
    }
  },

  async createUser(req, res) {
    try {
      const result = await AdminModel.createUser(req.body);
      return res.status(201).json({
        message: "Create user successfully",
        insertId: result.insertId,
      });
    } catch (error) {
      return sendError(res, error, "Create user error:");
    }
  },

  async updateUser(req, res) {
    try {
      await AdminModel.updateUser(req.params.id, req.body);
      return res.json({ message: "Update user successfully" });
    } catch (error) {
      return sendError(res, error, "Update user error:");
    }
  },

  async updateUserRole(req, res) {
    try {
      const { role } = req.body;
      await AdminModel.updateUserRole(req.params.id, role);
      return res.json({ message: "Update user role successfully" });
    } catch (error) {
      return sendError(res, error, "Update user role error:");
    }
  },

  async deleteUser(req, res) {
    try {
      const userId = req.params.id;
      const result = await AdminModel.deleteUser(userId);

      return res.json({
        message: "Delete user successfully",
        result,
      });
    } catch (error) {
      return sendError(res, error, "Delete user error:");
    }
  },

  // ================= BOOKINGS =================
  async getAllBookings(req, res) {
    try {
      const data = await AdminModel.getAllBookings();
      return res.json({ message: "Get bookings successfully", data });
    } catch (error) {
      return sendError(res, error, "Get bookings error:");
    }
  },

  async updateBookingStatus(req, res) {
    try {
      const { status } = req.body;
      await AdminModel.updateBookingStatus(req.params.id, status);
      return res.json({ message: "Update booking status successfully" });
    } catch (error) {
      return sendError(res, error, "Update booking status error:");
    }
  },
};

module.exports = adminController;
