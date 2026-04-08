"use client";

import BannerSlider from "@/components/home/BannerSlider";
import MovieSection from "@/components/home/MovieSection";
import MemberSection from "@/components/home/MemberSection";
import NewSection from "@/components/home/NewSection";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl space-y-10 px-4 py-6">
      <BannerSlider />

      <MovieSection />

      <MemberSection />

      <NewSection />
    </main>
  );
}
