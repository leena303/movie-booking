"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface NewsItem {
  id: number;
  title: string;
  description: string;
  image: string;
  link: string;
}

export default function NewSection() {
  const [newsList] = useState<NewsItem[]>([
    {
      id: 1,
      title: "Top những bộ phim đáng xem trong tháng này",
      description:
        "Khám phá danh sách phim nổi bật với nhiều thể loại hấp dẫn.",
      image:
        "https://images.unsplash.com/photo-1513106580091-1d82408b8cd6?q=80&w=1200&auto=format&fit=crop",
      link: "/",
    },
    {
      id: 2,
      title: "Kinh nghiệm chọn ghế đẹp khi xem phim",
      description:
        "Một vài mẹo giúp bạn có trải nghiệm xem phim tốt hơn.",
      image:
        "https://images.unsplash.com/photo-1585951237318-9ea5e175b891?q=80&w=1200&auto=format&fit=crop",
      link: "/",
    },
    {
      id: 3,
      title: "Cập nhật giao diện đặt vé mới",
      description: "Hệ thống MovieBooking đã được nâng cấp hiện đại hơn.",
      image:
        "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=1200&auto=format&fit=crop",
      link: "/",
    },
  ]);

  return (
    <section className="container my-5">
      <div className="mb-4">
        <p className="text-danger text-uppercase fw-semibold mb-1">Tin tức</p>
        <h2 className="fw-bold">Bài viết và cập nhật mới</h2>
      </div>

      <div className="row g-4">
        {newsList.map((item) => (
          <div key={item.id} className="col-md-4">
            <div className="card shadow-sm h-100 border-0">
              <div style={{ height: 200, position: "relative" }}>
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-fit-cover rounded-top"
                />
              </div>

              <div className="card-body d-flex flex-column">
                <h5 className="fw-semibold">{item.title}</h5>

                <p className="text-muted small flex-grow-1">
                  {item.description}
                </p>

                <Link
                  href={item.link}
                  className="text-danger fw-semibold text-decoration-none"
                >
                  Xem thêm →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
