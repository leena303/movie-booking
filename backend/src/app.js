const express = require("express");
const cors = require("cors");

const adminRoutes = require("./routes/admin.routes");
const authRoutes = require("./routes/auth.routes");
const movieRoutes = require("./routes/movie.routes");
const showtimeRoutes = require("./routes/showtime.routes");
const seatRoutes = require("./routes/seat.routes");
const bookingRoutes = require("./routes/booking.routes");

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://movie-booking-yv55.vercel.app",
  "https://movie-booking-cbxi.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.options("*", cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Movie Booking API is running",
  });
});

app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/showtimes", showtimeRoutes);
app.use("/api/seats", seatRoutes);
app.use("/api/bookings", bookingRoutes);

module.exports = app;
