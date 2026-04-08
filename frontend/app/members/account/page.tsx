import Link from "next/link";

export default function MemberAccountPage() {
  return (
    <main className="container py-5">
      <section className="bg-white p-4 p-md-5 rounded shadow-sm">
        <p className="text-uppercase text-danger fw-semibold small">
          Thành viên
        </p>

        <h1 className="fw-bold text-dark">Tài khoản MovieBooking</h1>

        <p className="text-muted mt-3 col-md-8">
          Tạo tài khoản để đặt vé nhanh hơn, lưu lịch sử giao dịch, quản lý
          thông tin cá nhân và theo dõi các bộ phim bạn quan tâm.
        </p>

        <div className="row mt-4 g-3">
          <div className="col-md-4">
            <div className="border rounded p-4 bg-light">
              <h5 className="fw-semibold">Đăng ký nhanh chóng</h5>
              <p className="text-muted small mt-2">
                Chỉ với vài bước đơn giản, bạn đã có thể tạo tài khoản và bắt
                đầu đặt vé online.
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="border rounded p-4 bg-light">
              <h5 className="fw-semibold">Quản lý lịch sử vé</h5>
              <p className="text-muted small mt-2">
                Theo dõi các vé đã đặt, thời gian chiếu, phòng chiếu và trạng
                thái thanh toán.
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="border rounded p-4 bg-light">
              <h5 className="fw-semibold">Cập nhật thông tin</h5>
              <p className="text-muted small mt-2">
                Dễ dàng chỉnh sửa tên, số điện thoại, địa chỉ và email.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 d-flex gap-2 flex-wrap">
          <Link href="/register" className="btn btn-danger">
            Đăng ký ngay
          </Link>

          <Link href="/login" className="btn btn-outline-danger">
            Đăng nhập
          </Link>
        </div>
      </section>
    </main>
  );
}
