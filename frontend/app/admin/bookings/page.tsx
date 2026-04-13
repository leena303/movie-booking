"use client";

import { useEffect, useState } from "react";
import { AdminBooking, UpdateBookingStatusPayload } from "@/types/admin";
import { adminService } from "@/services/admin";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  async function fetchBookings() {
    try {
      setLoading(true);
      setError("");
      const data = await adminService.getBookings();
      setBookings(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBookings();
  }, []);

  async function handleChangeStatus(
    bookingId: number,
    status: UpdateBookingStatusPayload["status"],
  ) {
    try {
      setUpdatingId(bookingId);
      setError("");

      await adminService.updateBookingStatus(bookingId, { status });

      setBookings((prev) =>
        prev.map((item) =>
          item.booking_id === bookingId ? { ...item, status } : item,
        ),
      );
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Cập nhật trạng thái booking thất bại",
      );
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div>
      <h2 className="mb-4">Quản lý vé</h2>

      {loading && (
        <div className="alert alert-secondary">Đang tải dữ liệu...</div>
      )}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && (
        <div className="card border-0 shadow-sm">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Phim</th>
                    <th>Người dùng</th>
                    <th>Giá</th>
                    <th>Trạng thái</th>
                    <th>Cập nhật</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.length > 0 ? (
                    bookings.map((b) => (
                      <tr key={b.booking_id}>
                        <td className="fw-semibold">{b.movie_title}</td>
                        <td>{b.user_name || b.email || "N/A"}</td>
                        <td>
                          {Number(b.total_price).toLocaleString("vi-VN")}đ
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              b.status === "confirmed"
                                ? "bg-success"
                                : b.status === "pending"
                                  ? "bg-warning text-dark"
                                  : "bg-danger"
                            }`}
                          >
                            {b.status === "confirmed"
                              ? "Đã xác nhận"
                              : b.status === "pending"
                                ? "Chờ xác nhận"
                                : "Đã hủy"}
                          </span>
                        </td>
                        <td style={{ minWidth: 180 }}>
                          <select
                            className="form-select form-select-sm"
                            value={b.status}
                            disabled={updatingId === b.booking_id}
                            onChange={(e) =>
                              handleChangeStatus(
                                b.booking_id,
                                e.target
                                  .value as UpdateBookingStatusPayload["status"],
                              )
                            }
                          >
                            <option value="pending">Chờ xác nhận</option>
                            <option value="confirmed">Đã xác nhận</option>
                            <option value="cancelled">Đã hủy</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center text-muted py-4">
                        Chưa có vé nào
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// "use client";

// import { useEffect, useState } from "react";
// import { AdminBooking } from "@/types/admin";
// import { adminService } from "@/services/admin";

// export default function AdminBookingsPage() {
//   const [bookings, setBookings] = useState<AdminBooking[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string>("");

//   useEffect(() => {
//     async function fetchBookings() {
//       try {
//         setLoading(true);
//         setError("");
//         const data = await adminService.getBookings();

//         console.log("bookings data:", data);

//         setBookings(Array.isArray(data) ? data : []);
//       } catch (err: unknown) {
//         setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchBookings();
//   }, []);

//   return (
//     <div>
//       <h2 className="mb-4">Quản lý vé</h2>

//       {loading && (
//         <div className="alert alert-secondary">Đang tải dữ liệu...</div>
//       )}
//       {error && <div className="alert alert-danger">{error}</div>}

//       {!loading && !error && (
//         <div className="card border-0 shadow-sm">
//           <div className="card-body p-0">
//             <div className="table-responsive">
//               <table className="table table-hover align-middle mb-0">
//                 <thead className="table-light">
//                   <tr>
//                     <th>Phim</th>
//                     <th>Người dùng</th>
//                     <th>Giá</th>
//                     <th>Trạng thái</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {bookings.length > 0 ? (
//                     bookings.map((b, index) => (
//                       <tr key={`${b.booking_id ?? "missing"}-${index}`}>
//                         <td className="fw-semibold">{b.movie_title}</td>
//                         <td>{b.user_name || b.email || "N/A"}</td>
//                         <td>
//                           {Number(b.total_price).toLocaleString("vi-VN")}đ
//                         </td>
//                         <td>
//                           <span
//                             className={`badge ${
//                               b.status === "confirmed"
//                                 ? "bg-success"
//                                 : b.status === "pending"
//                                   ? "bg-warning text-dark"
//                                   : "bg-danger"
//                             }`}
//                           >
//                             {b.status === "confirmed"
//                               ? "Đã xác nhận"
//                               : b.status === "pending"
//                                 ? "Đang chờ"
//                                 : "Đã hủy"}
//                           </span>
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan={4} className="text-center text-muted py-4">
//                         Chưa có vé nào
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
