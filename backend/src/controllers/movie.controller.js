const MovieModel = require("../models/movie.model");

const movieController = {
  async getAllMovies(req, res) {
    try {
      const { search, genre, status } = req.query;
      const movies = await MovieModel.getAll(search, genre, status);

      return res.json({
        message: "Get movies successfully",
        data: movies,
      });
    } catch (error) {
      console.error("Get all movies error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },

  async getMovieById(req, res) {
    try {
      const { id } = req.params;
      const movie = await MovieModel.getById(id);

      if (!movie) {
        return res.status(404).json({ message: "Movie not found" });
      }

      return res.json({
        message: "Get movie successfully",
        data: movie,
      });
    } catch (error) {
      console.error("Get movie by id error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },
};

module.exports = movieController;