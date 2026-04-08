"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-light border-top mt-5">
      <div className="container py-5">
        <div className="row g-4">
          <div className="col-md-4">
            <h5 className="text-danger fw-bold">MovieBooking</h5>
            <p className="text-muted small mt-3">
              MovieBooking là nền tảng đặt vé xem phim trực tuyến nhanh chóng,
              tiện lợi và hiện đại. Chúng tôi giúp bạn dễ dàng tìm kiếm phim,
              lựa chọn suất chiếu và đặt vé chỉ trong vài bước đơn giản.
            </p>
            <p className="text-muted small">
              Với giao diện thân thiện, tốc độ nhanh và trải nghiệm mượt mà,
              MovieBooking mang đến cho bạn hành trình giải trí trọn vẹn mọi
              lúc, mọi nơi.
            </p>
          </div>

          <div className="col-md-4">
            <h6 className="fw-semibold mb-3">Liên kết nhanh</h6>
            <ul className="list-unstyled small">
              <li className="mb-2">
                <Link href="/" className="text-decoration-none text-muted">
                  Trang chủ
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  href="/movies"
                  className="text-decoration-none text-muted"
                >
                  Phim
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  href="/profile/bookings"
                  className="text-decoration-none text-muted"
                >
                  Lịch sử vé
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/login" className="text-decoration-none text-muted">
                  Đăng nhập
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="text-decoration-none text-muted"
                >
                  Đăng ký
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-md-4">
            <h6 className="fw-semibold mb-3">Liên hệ</h6>
            <p className="text-muted small mb-1">
              Email: support@moviebooking.com
            </p>
            <p className="text-muted small mt-2">
              Giờ làm việc: 8:00 - 22:00 (Tất cả các ngày, kể cả Lễ Tết)
            </p>
            <p className="text-muted small mb-1">Hotline: 0123 456 789</p>
            <p className="text-muted small mb-1">Địa chỉ: Phú Yên, Việt Nam</p>
          </div>
        </div>

        <hr className="my-4" />

        <div className="row text-center small text-muted">
          <div className="col-md-6 mb-2 mb-md-0">
            Chính sách bảo mật | Điều khoản sử dụng
          </div>
          <div className="col-md-6">
            Hỗ trợ khách hàng 24/7 - Luôn sẵn sàng phục vụ bạn
          </div>
        </div>
      </div>

      <div className="text-center py-3 border-top small text-muted">
        © 2026 MovieBooking. All rights reserved.
      </div>
    </footer>
  );
}
