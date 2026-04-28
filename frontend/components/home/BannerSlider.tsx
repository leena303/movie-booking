"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const banners = [
  {
    id: 1,
    title: "Đặt vé xem phim nhanh chóng",
    description:
      "Khám phá phim mới, chọn suất chiếu và đặt vé chỉ trong vài bước đơn giản.",
    image:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1600&auto=format&fit=crop",
    buttonText: "Xem phim ngay",
    buttonLink: "/movies",
  },
  {
    id: 2,
    title: "Phim đang chiếu và sắp chiếu",
    description:
      "Cập nhật danh sách phim nổi bật với giao diện dễ nhìn, dễ sử dụng.",
    image:
      "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1600&auto=format&fit=crop",
    buttonText: "Khám phá",
    buttonLink: "#movies-section",
  },
  {
    id: 3,
    title: "Trải nghiệm điện ảnh đơn giản hơn",
    description:
      "Tạo tài khoản để quản lý lịch sử vé và theo dõi các bộ phim yêu thích.",
    image:
      "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?q=80&w=1600&auto=format&fit=crop",
    buttonText: "Đăng ký ngay",
    buttonLink: "/register",
  },
];

export default function BannerSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const currentBanner = banners[currentIndex];

  return (
    <section className="container my-4">
      <div
        className="position-relative overflow-hidden rounded-4 shadow"
        style={{
          minHeight: "460px",
        }}
      >
        <Image
          src={currentBanner.image}
          alt={currentBanner.title}
          fill
          priority
          className="object-fit-cover"
          style={{ zIndex: 0 }}
        />

        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background:
              "linear-gradient(90deg, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.25) 100%)",
            zIndex: 1,
          }}
        />

        <div className="position-relative z-1 h-100 d-flex align-items-center">
          <div className="container py-5 px-4 px-md-5">
            <div className="row">
              <div className="col-lg-7 col-md-9">
                <span
                  className="badge rounded-pill px-3 py-2 mb-3"
                  style={{
                    backgroundColor: "#dc3545",
                    fontSize: "0.8rem",
                    letterSpacing: "0.5px",
                  }}
                >
                  CineGo
                </span>

                <h1
                  className="fw-bold text-white mb-3"
                  style={{
                    fontSize: "clamp(2rem, 4vw, 3.5rem)",
                    lineHeight: 1.2,
                  }}
                >
                  {currentBanner.title}
                </h1>

                <p
                  className="text-light mb-4"
                  style={{
                    maxWidth: "600px",
                    fontSize: "1.05rem",
                    lineHeight: 1.8,
                  }}
                >
                  {currentBanner.description}
                </p>

                <div className="d-flex flex-wrap gap-3">
                  <Link
                    href={currentBanner.buttonLink}
                    className="btn btn-danger btn-lg px-4 fw-semibold"
                  >
                    {currentBanner.buttonText}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handlePrev}
          className="btn position-absolute top-50 start-0 translate-middle-y ms-3 rounded-circle d-flex align-items-center justify-content-center"
          style={{
            width: "48px",
            height: "48px",
            backgroundColor: "rgba(255,255,255,0.85)",
            border: "none",
            zIndex: 2,
            fontSize: "1.4rem",
            fontWeight: 700,
          }}
          aria-label="Banner trước"
        >
          ‹
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="btn position-absolute top-50 end-0 translate-middle-y me-3 rounded-circle d-flex align-items-center justify-content-center"
          style={{
            width: "48px",
            height: "48px",
            backgroundColor: "rgba(255,255,255,0.85)",
            border: "none",
            zIndex: 2,
            fontSize: "1.4rem",
            fontWeight: 700,
          }}
          aria-label="Banner tiếp theo"
        >
          ›
        </button>

        <div
          className="position-absolute start-50 translate-middle-x d-flex gap-2"
          style={{ bottom: "18px", zIndex: 2 }}
        >
          {banners.map((banner, index) => (
            <button
              key={banner.id}
              type="button"
              onClick={() => setCurrentIndex(index)}
              aria-label={`Chuyển đến banner ${index + 1}`}
              className="border-0 rounded-circle"
              style={{
                width: currentIndex === index ? "26px" : "10px",
                height: "10px",
                backgroundColor:
                  currentIndex === index ? "#dc3545" : "rgba(255,255,255,0.75)",
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
