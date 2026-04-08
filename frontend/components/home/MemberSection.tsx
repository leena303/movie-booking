"use client";

import { useState } from "react";
import Link from "next/link";

interface Benefit {
  id: number;
  title: string;
  description: string;
}

export default function MemberSection() {
  const [benefits] = useState<Benefit[]>([
    {
      id: 1,
      title: "Tạo tài khoản dễ dàng",
      description:
        "Đăng ký nhanh để lưu thông tin cá nhân và quản lý lịch sử đặt vé.",
    },
    {
      id: 2,
      title: "Theo dõi lịch sử vé",
      description:
        "Xem lại các vé đã đặt, suất chiếu và thông tin phim một cách thuận tiện.",
    },
    {
      id: 3,
      title: "Nhận ưu đãi hấp dẫn",
      description:
        "Cập nhật khuyến mãi và thông tin phim mới dành cho người dùng thành viên.",
    },
  ]);

  return (
    <section className="container my-5">
      <div className="bg-light rounded p-4 p-md-5 shadow-sm">
        <div className="text-center mb-5">
          <p className="text-uppercase text-danger fw-semibold small">
            Thành viên
          </p>

          <h2 className="fw-bold">
            Quyền lợi dành cho thành viên MovieBooking
          </h2>

          <p className="text-muted col-md-8 mx-auto mt-3">
            Tạo tài khoản để đặt vé nhanh hơn, quản lý lịch sử giao dịch và theo
            dõi những cập nhật mới nhất từ hệ thống.
          </p>
        </div>

        <div className="row g-4 justify-content-center">
          {benefits.map((item) => (
            <div key={item.id} className="col-md-4">
              <div className="card border-0 shadow-sm h-100 text-center p-4">
                <div
                  className="rounded-circle bg-danger bg-opacity-10 text-danger d-flex align-items-center justify-content-center mx-auto mb-3"
                  style={{ width: 50, height: 50 }}
                >
                  ★
                </div>

                <h5 className="fw-semibold">{item.title}</h5>

                <p className="text-muted small mt-2">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-5">
          <Link href="/members/benefits" className="btn btn-danger px-4">
            Xem quyền lợi
          </Link>
        </div>
      </div>
    </section>
  );
}
