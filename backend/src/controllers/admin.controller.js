const AdminModel = require("../models/admin.model");

const adminController = {
  // ================= MOVIES =================
  async getAllMoviesAdmin(req, res) {
    try {
      const data = await AdminModel.getAllMovies();
      return res.json({ message: "Get movies successfully", data });
    } catch (error) {
      console.error("Get movies admin error:", error);
      return res.status(500).json({ message: "Server error" });
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
      console.error("Create movie error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },

  async updateMovie(req, res) {
    try {
      await AdminModel.updateMovie(req.params.id, req.body);
      return res.json({ message: "Update movie successfully" });
    } catch (error) {
      console.error("Update movie error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },

  async deleteMovie(req, res) {
    try {
      await AdminModel.deleteMovie(req.params.id);
      return res.json({ message: "Delete movie successfully" });
    } catch (error) {
      console.error("Delete movie error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },

  // ================= SHOWTIMES =================
  async getAllShowtimesAdmin(req, res) {
    try {
      const data = await AdminModel.getAllShowtimes();
      return res.json({ message: "Get showtimes successfully", data });
    } catch (error) {
      console.error("Get showtimes error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },

  async createShowtime(req, res) {
    try {
      const result = await AdminModel.createShowtime(req.body);
      return res.status(201).json({
        message: "Create showtime successfully",
        insertId: result.insertId,
      });
    } catch (error) {
      console.error("Create showtime error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },

  async updateShowtime(req, res) {
    try {
      await AdminModel.updateShowtime(req.params.id, req.body);
      return res.json({ message: "Update showtime successfully" });
    } catch (error) {
      console.error("Update showtime error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },

  async deleteShowtime(req, res) {
    try {
      await AdminModel.deleteShowtime(req.params.id);
      return res.json({ message: "Delete showtime successfully" });
    } catch (error) {
      console.error("Delete showtime error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },

  // ================= ROOMS =================
  async getAllRooms(req, res) {
    try {
      const data = await AdminModel.getAllRooms();
      return res.json({ message: "Get rooms successfully", data });
    } catch (error) {
      console.error("Get rooms error:", error);
      return res.status(500).json({ message: "Server error" });
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
      console.error("Create room error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },

  async updateRoom(req, res) {
    try {
      await AdminModel.updateRoom(req.params.id, req.body);
      return res.json({ message: "Update room successfully" });
    } catch (error) {
      console.error("Update room error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },

  async deleteRoom(req, res) {
    try {
      await AdminModel.deleteRoom(req.params.id);
      return res.json({ message: "Delete room successfully" });
    } catch (error) {
      console.error("Delete room error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },

  // ================= SEATS =================
  async getSeatsByRoom(req, res) {
    try {
      const data = await AdminModel.getSeatsByRoom(req.params.roomId);
      return res.json({ message: "Get seats successfully", data });
    } catch (error) {
      console.error("Get seats error:", error);
      return res.status(500).json({ message: "Server error" });
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
      console.error("Create seat error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },

  async updateSeat(req, res) {
    try {
      await AdminModel.updateSeat(req.params.id, req.body);
      return res.json({ message: "Update seat successfully" });
    } catch (error) {
      console.error("Update seat error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },

  async deleteSeat(req, res) {
    try {
      await AdminModel.deleteSeat(req.params.id);
      return res.json({ message: "Delete seat successfully" });
    } catch (error) {
      console.error("Delete seat error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },

  // ================= USERS (FIX CHÍNH) =================
  async getAllUsers(req, res) {
    try {
      const data = await AdminModel.getAllUsers();
      return res.json({ message: "Get users successfully", data });
    } catch (error) {
      console.error("Get users error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },

  // ✅ CREATE USER
  async createUser(req, res) {
    try {
      const result = await AdminModel.createUser(req.body);

      return res.status(201).json({
        message: "Create user successfully",
        insertId: result.insertId,
      });
    } catch (error) {
      console.error("Create user error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },

  async updateUser(req, res) {
    try {
      await AdminModel.updateUser(req.params.id, req.body);

      return res.json({ message: "Update user successfully" });
    } catch (error) {
      console.error("Update user error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },

  async updateUserRole(req, res) {
    try {
      const { role } = req.body;
      await AdminModel.updateUserRole(req.params.id, role);
      return res.json({ message: "Update user role successfully" });
    } catch (error) {
      console.error("Update user role error:", error);
      return res.status(500).json({ message: "Server error" });
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
      console.error("Delete user error:", error);
      return res.status(500).json({
        message: error.message || "Server error",
        error,
      });
    }
  },

  // ================= BOOKINGS =================
  async getAllBookings(req, res) {
    try {
      const data = await AdminModel.getAllBookings();
      return res.json({ message: "Get bookings successfully", data });
    } catch (error) {
      console.error("Get bookings error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },

  async updateBookingStatus(req, res) {
    try {
      const { status } = req.body;
      await AdminModel.updateBookingStatus(req.params.id, status);
      return res.json({ message: "Update booking status successfully" });
    } catch (error) {
      console.error("Update booking status error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },
};

module.exports = adminController;
