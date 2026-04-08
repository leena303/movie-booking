// "use client";

// import { Movie } from "@/types/movie";
// import Image from "next/image";
// import Link from "next/link";
// import { useRouter } from "next/navigation";

// export default function MovieRow({ movie }: { movie: Movie }) {
//   const router = useRouter();

//   function formatShowtime(dateString: string) {
//     return new Date(dateString).toLocaleString("vi-VN", {
//       day: "2-digit",
//       month: "2-digit",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   }

//   return (
//     <div className="flex gap-4 rounded-xl bg-white p-3 shadow transition hover:shadow-lg">
//       <Link href={`/movies/${movie.id}`}>
//         <div className="relative h-40 w-30 shrink-0 cursor-pointer">
//           <Image
//             src={movie.poster_url}
//             alt={movie.title}
//             fill
//             className="rounded-lg object-cover transition hover:opacity-80"
//           />
//         </div>
//       </Link>

//       <div className="mt-3 flex flex-1 items-center justify-between gap-4">
//         <div className="flex flex-wrap gap-2">
//           {movie.showtimes && movie.showtimes.length > 0 ? (
//             movie.showtimes.map((s) => (
//               <button
//                 key={s.id}
//                 onClick={() => router.push(`/booking/${s.id}`)}
//                 className="rounded border px-3 py-1 text-sm transition hover:bg-red-500 hover:text-white"
//               >
//                 {formatShowtime(s.start_time)}
//               </button>
//             ))
//           ) : (
//             <span className="text-sm text-gray-400">Chưa có lịch chiếu</span>
//           )}
//         </div>

//         <button
//           onClick={() => router.push(`/movies/${movie.id}`)}
//           className="whitespace-nowrap rounded-lg bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
//         >
//           Đặt vé
//         </button>
//       </div>
//     </div>
//   );
// }
