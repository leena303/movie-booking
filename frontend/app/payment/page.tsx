"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { bookingService } from "@/services/booking";
import { useAuth } from "@/hooks/useAuth";

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { token } = useAuth();

  const [showtimeId, setShowtimeId] = useState<number>(0);
  const [seatIds, setSeatIds] = useState<number[]>([]);

  // form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [cardNumber, setCardNumber] = useState("");

  const [ticketDelivery, setTicketDelivery] = useState("email");
  const [note, setNote] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stId = Number(searchParams.get("showtimeId"));
    const seats = searchParams.get("seats");

    if (stId && seats) {
      setShowtimeId(stId);
      setSeatIds(seats.split(",").map(Number));
    }
  }, [searchParams]);

  function validate() {
    if (!name.trim() || !phone.trim() || !email.trim()) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Email không hợp lệ");
      return false;
    }

    const phoneRegex = /^(0|\+84)\d{9,10}$/;
    if (!phoneRegex.test(phone.trim())) {
      alert("Số điện thoại không hợp lệ");
      return false;
    }

    if (
      (paymentMethod === "momo" || paymentMethod === "vnpay") &&
      !cardNumber.trim()
    ) {
      alert("Vui lòng nhập thông tin thanh toán");
      return false;
    }

    if (!agreeTerms) {
      alert("Vui lòng đồng ý điều khoản thanh toán");
      return false;
    }

    return true;
  }

  async function handlePayment() {
    if (!validate()) return;

    try {
      if (!token) {
        alert("Bạn cần đăng nhập");
        router.push("/login");
        return;
      }

      setLoading(true);

      await bookingService.createBooking({
        showtimeId,
        seatIds,
        name,
        phone,
        email,
        paymentMethod,
        cardNumber,
        ticketDelivery,
        note,
      });

      alert("Thanh toán thành công!");
      router.push("/profile/bookings");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Thanh toán thất bại");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card border-0 shadow rounded-4 overflow-hidden">
            <div className="bg-danger text-white p-4">
              <h2 className="fw-bold mb-1 text-center">
                Thanh toán vé xem phim
              </h2>
              <p className="mb-0 text-center opacity-75">
                Hoàn tất thông tin để xác nhận đặt vé của bạn
              </p>
            </div>

            <div className="card-body p-4 p-md-5 bg-light">
              <div className="row g-4">
                <div className="col-lg-5">
                  <div className="card border-0 shadow-sm rounded-4 h-100">
                    <div className="card-body p-4">
                      <h5 className="fw-bold mb-3">Thông tin đơn hàng</h5>

                      <div className="bg-body-tertiary rounded-4 p-3 mb-3">
                        <div className="d-flex justify-content-between mb-2">
                          <span className="text-muted">Showtime ID</span>
                          <strong>{showtimeId || "--"}</strong>
                        </div>

                        <div className="d-flex justify-content-between mb-2">
                          <span className="text-muted">Ghế đã chọn</span>
                          <strong>
                            {seatIds.length > 0 ? seatIds.join(", ") : "--"}
                          </strong>
                        </div>

                        <div className="d-flex justify-content-between mb-2">
                          <span className="text-muted">Số lượng ghế</span>
                          <strong>{seatIds.length}</strong>
                        </div>

                        <div className="d-flex justify-content-between">
                          <span className="text-muted">Hình thức nhận vé</span>
                          <strong>
                            {ticketDelivery === "email"
                              ? "Qua email"
                              : ticketDelivery === "counter"
                                ? "Tại quầy"
                                : "Qua SMS"}
                          </strong>
                        </div>
                      </div>

                      <div className="alert alert-warning rounded-4 mb-0">
                        <small>
                          Vui lòng kiểm tra kỹ thông tin trước khi thanh toán.
                          Vé sau khi xác nhận có thể được gửi theo hình thức bạn
                          đã chọn.
                        </small>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-7">
                  <div className="card border-0 shadow-sm rounded-4">
                    <div className="card-body p-4">
                      <h5 className="fw-bold mb-4">Thông tin khách hàng</h5>

                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label fw-semibold">
                            Họ và tên
                          </label>
                          <input
                            type="text"
                            className="form-control rounded-3"
                            placeholder="Nhập họ và tên"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                          />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label fw-semibold">
                            Số điện thoại
                          </label>
                          <input
                            type="text"
                            className="form-control rounded-3"
                            placeholder="Nhập số điện thoại"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                          />
                        </div>

                        <div className="col-12">
                          <label className="form-label fw-semibold">
                            Email
                          </label>
                          <input
                            type="email"
                            className="form-control rounded-3"
                            placeholder="Nhập email nhận vé"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>

                        <div className="col-12">
                          <label className="form-label fw-semibold">
                            Phương thức nhận vé
                          </label>
                          <select
                            className="form-select rounded-3"
                            value={ticketDelivery}
                            onChange={(e) => setTicketDelivery(e.target.value)}
                          >
                            <option value="email">Nhận vé qua email</option>
                            <option value="sms">Nhận mã vé qua SMS</option>
                            <option value="counter">Nhận vé tại quầy</option>
                          </select>
                        </div>

                        <div className="col-12">
                          <label className="form-label fw-semibold">
                            Ghi chú
                          </label>
                          <textarea
                            className="form-control rounded-3"
                            rows={3}
                            placeholder="Nhập ghi chú nếu có"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                          />
                        </div>

                        <div className="col-12 mt-4">
                          <h5 className="fw-bold mb-3">
                            Phương thức thanh toán
                          </h5>
                        </div>

                        <div className="col-12">
                          <select
                            className="form-select rounded-3"
                            value={paymentMethod}
                            onChange={(e) => {
                              setPaymentMethod(e.target.value);
                              setCardNumber("");
                            }}
                          >
                            <option value="cod">Thanh toán tại rạp</option>
                            <option value="momo">Momo</option>
                            <option value="vnpay">VNPay</option>
                          </select>
                        </div>

                        {paymentMethod === "momo" && (
                          <div className="col-12">
                            <label className="form-label fw-semibold">
                              Số điện thoại Momo
                            </label>
                            <input
                              type="text"
                              className="form-control rounded-3"
                              placeholder="Nhập số điện thoại Momo"
                              value={cardNumber}
                              onChange={(e) => setCardNumber(e.target.value)}
                            />
                          </div>
                        )}

                        {paymentMethod === "vnpay" && (
                          <div className="col-12">
                            <label className="form-label fw-semibold">
                              Số thẻ ngân hàng
                            </label>
                            <input
                              type="text"
                              className="form-control rounded-3"
                              placeholder="Nhập số thẻ ngân hàng"
                              value={cardNumber}
                              onChange={(e) => setCardNumber(e.target.value)}
                            />
                          </div>
                        )}

                        <div className="col-12">
                          <div className="form-check mt-2">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="agreeTerms"
                              checked={agreeTerms}
                              onChange={(e) => setAgreeTerms(e.target.checked)}
                            />
                            <label
                              className="form-check-label text-muted"
                              htmlFor="agreeTerms"
                            >
                              Tôi đồng ý với điều khoản thanh toán và xác nhận
                              thông tin đã nhập là chính xác
                            </label>
                          </div>
                        </div>

                        <div className="col-12 d-grid mt-3">
                          <button
                            onClick={handlePayment}
                            disabled={loading}
                            className="btn btn-danger rounded-3 py-2 fw-semibold"
                          >
                            {loading ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" />
                                Đang xử lý...
                              </>
                            ) : (
                              "Xác nhận thanh toán"
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center text-muted small mt-3">
            Cần hỗ trợ? Vui lòng liên hệ nhân viên rạp hoặc bộ phận chăm sóc
            khách hàng.
          </div>
        </div>
      </div>
    </div>
  );
}
