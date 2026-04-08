"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/admin";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    users: 0,
    movies: 0,
    bookings: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const [users, movies, bookings] = await Promise.all([
          adminService.getUsers(),
          adminService.getMovies(),
          adminService.getBookings(),
        ]);

        setStats({
          users: users.length,
          movies: movies.length,
          bookings: bookings.length,
        });
      } catch (err) {
        console.error(err);
      }
    }

    fetchStats();
  }, []);

  return (
    <div>
      <h2 className="mb-4">Dashboard</h2>

      <div className="row g-4">
        <div className="col-md-4">
          <div className="card p-4 text-center">
            <p className="text-muted">Users</p>
            <h3 className="text-primary">{stats.users}</h3>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card p-4 text-center">
            <p className="text-muted">Movies</p>
            <h3 className="text-success">{stats.movies}</h3>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card p-4 text-center">
            <p className="text-muted">Bookings</p>
            <h3 className="text-danger">{stats.bookings}</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
