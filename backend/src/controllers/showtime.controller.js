const ShowtimeModel = require("../models/showtime.model");

const showtimeController = {
  async getAllShowtimes(req, res) {
    try {
      const data = await ShowtimeModel.getAll();
      return res.json({
        message: "Get showtimes successfully",
        data,
      });
    } catch (error) {
      console.error("Get all showtimes error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },

  async getShowtimesByMovieId(req, res) {
    try {
      const { movieId } = req.params;
      const data = await ShowtimeModel.getByMovieId(movieId);

      return res.json({
        message: "Get showtimes by movie successfully",
        data,
      });
    } catch (error) {
      console.error("Get showtimes by movie error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },
};

module.exports = showtimeController;