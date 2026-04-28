export default function MemberBenefitsPage() {
  const benefits = [
    {
      id: 1,
      title: "Đặt vé tiện lợi",
      description:
        "Chọn phim, suất chiếu và ghế ngồi nhanh chóng ngay trên website.",
    },
    {
      id: 2,
      title: "Lưu lịch sử giao dịch",
      description:
        "Theo dõi các vé đã đặt để dễ dàng kiểm tra thông tin khi cần.",
    },
    {
      id: 3,
      title: "Cập nhật phim mới",
      description:
        "Theo dõi các bộ phim đang chiếu và sắp chiếu chỉ trong vài thao tác.",
    },
    {
      id: 4,
      title: "Quản lý tài khoản cá nhân",
      description:
        "Chỉnh sửa thông tin cá nhân và quản lý tài khoản thuận tiện hơn.",
    },
    {
      id: 5,
      title: "Giao diện dễ sử dụng",
      description:
        "Thiết kế đơn giản, rõ ràng, phù hợp cho cả người mới sử dụng.",
    },
    {
      id: 6,
      title: "Trải nghiệm xem phim tốt hơn",
      description:
        "Dễ dàng chọn ghế, kiểm tra trạng thái ghế và hoàn tất đặt vé nhanh.",
    },
  ];

  return (
    <main className="container py-5">
      <section>
        <div className="bg-white p-4 p-md-5 rounded shadow-sm mb-4">
          <p className="text-uppercase text-danger fw-semibold small">
            Quyền lợi thành viên
          </p>

          <h1 className="fw-bold text-dark">Lợi ích khi có tài khoản CineGo</h1>

          <p className="text-muted mt-3 col-md-8">
            Tài khoản thành viên giúp bạn đặt vé nhanh hơn, quản lý thông tin dễ
            hơn và theo dõi các bộ phim yêu thích thuận tiện hơn.
          </p>
        </div>

        <div className="row g-3">
          {benefits.map((item) => (
            <div key={item.id} className="col-md-6 col-lg-4">
              <div className="border rounded p-4 h-100 shadow-sm">
                <div
                  className="mb-3 d-flex align-items-center justify-content-center rounded-circle bg-danger bg-opacity-10 text-danger"
                  style={{ width: 44, height: 44 }}
                >
                  ★
                </div>

                <h5 className="fw-semibold">{item.title}</h5>

                <p className="text-muted small mt-2">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
