-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th4 12, 2026 lúc 06:28 PM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `movie_booking`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `bookings`
--

CREATE TABLE `bookings` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED DEFAULT NULL,
  `showtime_id` int(10) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `email` varchar(150) NOT NULL,
  `payment_method` varchar(50) NOT NULL DEFAULT 'cash',
  `card_number` varchar(50) DEFAULT NULL,
  `total_price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `status` enum('pending','confirmed','cancelled') NOT NULL DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `bookings`
--

INSERT INTO `bookings` (`id`, `user_id`, `showtime_id`, `name`, `phone`, `email`, `payment_method`, `card_number`, `total_price`, `status`, `created_at`) VALUES
(1, 2, 1, 'Nguyễn Văn A', '0900000002', 'user1@moviebooking.com', 'cash', NULL, 180000.00, 'confirmed', '2026-03-31 02:39:30');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `booking_details`
--

CREATE TABLE `booking_details` (
  `id` int(10) UNSIGNED NOT NULL,
  `booking_id` int(10) UNSIGNED NOT NULL,
  `seat_id` int(10) UNSIGNED NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `booking_details`
--

INSERT INTO `booking_details` (`id`, `booking_id`, `seat_id`, `price`, `created_at`) VALUES
(1, 1, 1, 90000.00, '2026-03-31 02:39:30'),
(2, 1, 2, 90000.00, '2026-03-31 02:39:30');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `cinemas`
--

CREATE TABLE `cinemas` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(150) NOT NULL,
  `location` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `cinemas`
--

INSERT INTO `cinemas` (`id`, `name`, `location`, `created_at`) VALUES
(1, 'MovieBooking Tuy Hòa', 'Tuy Hòa, Phú Yên', '2026-03-31 02:39:30'),
(2, 'MovieBooking Sông Cầu', 'Sông Cầu, Phú Yên', '2026-03-31 02:39:30');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `movies`
--

CREATE TABLE `movies` (
  `id` int(10) UNSIGNED NOT NULL,
  `title` varchar(200) NOT NULL,
  `genre` varchar(150) NOT NULL,
  `duration_min` int(11) NOT NULL,
  `description` text NOT NULL,
  `poster_url` varchar(500) NOT NULL,
  `status` enum('now_showing','coming_soon') NOT NULL DEFAULT 'coming_soon',
  `release_date` date NOT NULL,
  `director` varchar(150) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `movies`
--

INSERT INTO `movies` (`id`, `title`, `genre`, `duration_min`, `description`, `poster_url`, `status`, `release_date`, `director`, `created_at`) VALUES
(1, 'CÚ NHẢY KỲ DIỆU', 'Gia đình, Hài, Hoạt Hình, Phiêu Lưu', 105, 'Hoppers xoay quanh Mabel, một cô gái yêu động vật, vô tình tiếp cận công nghệ cho phép chuyển ý thức con người vào cơ thể robot động vật. Nhờ đó, Mabel “nhảy” vào thế giới tự nhiên dưới hình dạng một con hải ly và có thể giao tiếp trực tiếp với các loài khác. Trong hành trình này, cô dần khám phá cách động vật nhìn nhận con người, đồng thời phát hiện những mối nguy đang đe dọa môi trường sống của chúng. Tận dụng công nghệ Nhảy, Mabel đã trở thành cầu nối, mang lại cuộc sống cân bằng cho cả con người và động vật.', '/images/hoppers.jpg', 'now_showing', '2026-03-01', 'Daniel Chong', '2026-03-13 02:30:00'),
(2, 'QUỶ NHẬP TRÀNG 2', 'Hồi hộp, Kinh Dị', 126, 'Quỷ Nhập Tràng 2 là tiền truyện của nhân vật Minh Như, trở về xưởng nhuộm gia đình sau nhiều năm bị xua đuổi. Tại đây, cô phải đối mặt với những hiện tượng ma quái cùng sự thật tàn khốc về cái chết của mẹ và giao ước đẫm máu năm xưa. Ác giả ác báo, liệu Minh Như có thoát khỏi vòng vây của quỷ dữ?', '/images/quy-nhap-trang.jpg', 'now_showing', '2026-05-18', 'Pom Nguyễn', '2026-05-18 11:00:00'),
(3, 'ĐẾM NGÀY XA MẸ', 'Gia đình', 109, 'Đếm Ngày Xa Mẹ xoay quanh cặp mẹ con Eun-sil (Jang Hye-jin) và Ha-min (Choi Woo-shik). Mỗi lần ăn một món do mẹ nấu, Ha-min lại nhìn thấy một con số khó lý giải. Sau mỗi bữa ăn, con số ấy giảm đi một đơn vị. Ha-min sớm nhận ra một sự thật kinh hoàng: khi con số chạm về 0, mẹ anh sẽ qua đời. Kể từ đó, cuộc sống bình thường của Ha-min bị đảo lộn hoàn toàn. Để bảo vệ quãng thời gian còn lại của mẹ, Ha-min bắt đầu tránh xa những bữa cơm nhà, viện đủ mọi lý do để không phải ngồi vào bàn ăn và dần trở nên xa cách với mẹ. Liệu thời gian để Hamin ở bên mẹ còn được bao lâu nữa?', '/images/dem-ngay-xa-me.jpg', 'now_showing', '2026-04-10', 'Kim Tae-yong', '2026-04-10 06:30:30'),
(4, 'TIẾNG THÉT 7', 'Bí ẩn, Kinh Dị', 113, 'Sidney Evans (Neve Campbell), nạn nhân sống sót của một vụ thảm sát nhiều năm trước, giờ đang sống hạnh phúc cùng chồng và con gái ở một thị trấn khác thì tên sát nhân Ghostface mới lại xuất hiện. Những nỗi sợ hãi đen tối nhất của cô trở thành hiện thực khi con gái cô Tatum Evans (Isabel May) trở thành mục tiêu tiếp theo. Quyết tâm bảo vệ gia đình, Sidney buộc phải đối mặt với những kinh hoàng trong quá khứ để chấm dứt cuộc đổ máu một lần và mãi mãi.', '/images/tieng-thet-7.jpg', 'coming_soon', '2026-04-28', 'Kevin Williamson', '2026-04-28 03:20:30'),
(5, 'CÁ VOI NHỎ CHU DU ĐẠI DƯƠNG', 'Gia đình, Hoạt Hình, Thần thoại', 92, 'Vincent – chú cá voi lưng gù nhút nhát, con trai của huyền thoại “ca sĩ đại dương” cuối cùng – chưa bao giờ tin mình đủ dũng cảm. Nhưng khi quái vật Leviathan thoát khỏi tảng băng tan và đe dọa mọi sinh vật biển, Vincent buộc phải lên đường. Giữa hành trình chu du khắp đại dương cùng những người bạn, cậu dần học cách vượt qua nỗi sợ và tìm ra tiếng hát của riêng mình. Một chuyến phiêu lưu kỳ diệu Một câu chuyện ấm áp về lòng dũng cảm và tình bạn Phim hoạt hình không thể bỏ lỡ cho cả gia đình.', '/images/ca-voi-nho.jpg', 'coming_soon', '2026-04-25', 'Pavel Hrubos, Steven Majaury, Reza Memari', '2026-03-31 03:19:36'),
(6, 'TỘI PHẠM 101', 'Hồi hộp, Tội phạm', 140, 'Lấy bối cảnh thành phố Los Angeles đầy nắng và bụi đường, Tội Phạm 101 kể về một tên trộm nữ trang bí ẩn (Chris Hemsworth) với hàng loạt phi vụ táo bạo khiến cảnh sát phải đau đầu. Trong lúc chuẩn bị cho phi vụ lớn nhất của mình, hắn gặp gỡ một nữ nhân viên bảo hiểm (Halle Berry), người cũng đang vật lộn với những lựa chọn trong đời mình. Trong khi đó, một thanh tra (Mark Ruffalo) đã tìm ra quy luật trong chuỗi các vụ án và đang ráo riết truy đuổi tên trộm, khiến cuộc chơi trở nên căng thẳng hơn bao giờ hết. Khi phi vụ định mệnh đến gần, ranh giới giữa kẻ săn đuổi và con mồi dần trở nên mờ nhạt và cả ba buộc phải đối mặt với những lựa chọn khó khăn và không còn cơ hội để quay đầu lại. Bộ phim được chuyển thể từ tiểu thuyết ngắn nổi tiếng cùng tên của Don Winslow, do Bart Layton (tác giả của American Animals, The Imposter) viết kịch bản và đạo diễn. Dàn diễn viên có sự tham gia của Barry Keoghan, Monica Barbaro, Corey Hawkins, Jennifer Jason Leigh và Nick Nolte.', '/images/toi-pham-101.jpg', 'coming_soon', '2026-04-24', 'Bart Layton', '2026-03-31 03:19:36');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `rooms`
--

CREATE TABLE `rooms` (
  `id` int(10) UNSIGNED NOT NULL,
  `cinema_id` int(10) UNSIGNED NOT NULL,
  `name` varchar(50) NOT NULL,
  `total_rows` int(11) NOT NULL,
  `total_cols` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `rooms`
--

INSERT INTO `rooms` (`id`, `cinema_id`, `name`, `total_rows`, `total_cols`, `created_at`) VALUES
(1, 1, 'Phòng 1', 5, 8, '2026-03-31 02:39:30'),
(2, 1, 'Phòng 2', 5, 8, '2026-03-31 02:39:30'),
(3, 2, 'Phòng 1', 5, 8, '2026-03-31 02:39:30');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `seats`
--

CREATE TABLE `seats` (
  `id` int(10) UNSIGNED NOT NULL,
  `room_id` int(10) UNSIGNED NOT NULL,
  `row_label` char(1) NOT NULL,
  `col_number` int(11) NOT NULL,
  `type` enum('standard','vip') NOT NULL DEFAULT 'standard',
  `is_booked` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `seats`
--

INSERT INTO `seats` (`id`, `room_id`, `row_label`, `col_number`, `type`, `is_booked`) VALUES
(1, 1, 'A', 1, 'standard', 1),
(2, 1, 'A', 2, 'standard', 1),
(3, 1, 'A', 3, 'standard', 0),
(4, 1, 'A', 4, 'standard', 0),
(5, 1, 'A', 5, 'standard', 0),
(6, 1, 'A', 6, 'standard', 0),
(7, 1, 'A', 7, 'standard', 0),
(8, 1, 'A', 8, 'standard', 0),
(9, 1, 'B', 1, 'standard', 0),
(10, 1, 'B', 2, 'standard', 0),
(11, 1, 'B', 3, 'standard', 0),
(12, 1, 'B', 4, 'standard', 0),
(13, 1, 'B', 5, 'standard', 0),
(14, 1, 'B', 6, 'standard', 0),
(15, 1, 'B', 7, 'standard', 0),
(16, 1, 'B', 8, 'standard', 0),
(17, 1, 'C', 1, 'standard', 0),
(18, 1, 'C', 2, 'standard', 0),
(19, 1, 'C', 3, 'standard', 0),
(20, 1, 'C', 4, 'standard', 0),
(21, 1, 'C', 5, 'standard', 0),
(22, 1, 'C', 6, 'standard', 0),
(23, 1, 'C', 7, 'standard', 0),
(24, 1, 'C', 8, 'standard', 0),
(25, 1, 'D', 1, 'vip', 0),
(26, 1, 'D', 2, 'vip', 0),
(27, 1, 'D', 3, 'vip', 0),
(28, 1, 'D', 4, 'vip', 0),
(29, 1, 'D', 5, 'vip', 0),
(30, 1, 'D', 6, 'vip', 0),
(31, 1, 'D', 7, 'vip', 0),
(32, 1, 'D', 8, 'vip', 0),
(33, 1, 'E', 1, 'vip', 0),
(34, 1, 'E', 2, 'vip', 0),
(35, 1, 'E', 3, 'vip', 0),
(36, 1, 'E', 4, 'vip', 0),
(37, 1, 'E', 5, 'vip', 0),
(38, 1, 'E', 6, 'vip', 0),
(39, 1, 'E', 7, 'vip', 0),
(40, 1, 'E', 8, 'vip', 0),
(41, 2, 'A', 1, 'standard', 0),
(42, 2, 'A', 2, 'standard', 0),
(43, 2, 'A', 3, 'standard', 0),
(44, 2, 'A', 4, 'standard', 0),
(45, 2, 'A', 5, 'standard', 0),
(46, 2, 'A', 6, 'standard', 0),
(47, 2, 'A', 7, 'standard', 0),
(48, 2, 'A', 8, 'standard', 0),
(49, 2, 'B', 1, 'standard', 0),
(50, 2, 'B', 2, 'standard', 0),
(51, 2, 'B', 3, 'standard', 0),
(52, 2, 'B', 4, 'standard', 0),
(53, 2, 'B', 5, 'standard', 0),
(54, 2, 'B', 6, 'standard', 0),
(55, 2, 'B', 7, 'standard', 0),
(56, 2, 'B', 8, 'standard', 0),
(57, 2, 'C', 1, 'standard', 0),
(58, 2, 'C', 2, 'standard', 0),
(59, 2, 'C', 3, 'standard', 0),
(60, 2, 'C', 4, 'standard', 0),
(61, 2, 'C', 5, 'standard', 0),
(62, 2, 'C', 6, 'standard', 0),
(63, 2, 'C', 7, 'standard', 0),
(64, 2, 'C', 8, 'standard', 0),
(65, 2, 'D', 1, 'vip', 0),
(66, 2, 'D', 2, 'vip', 0),
(67, 2, 'D', 3, 'vip', 0),
(68, 2, 'D', 4, 'vip', 0),
(69, 2, 'D', 5, 'vip', 0),
(70, 2, 'D', 6, 'vip', 1),
(71, 2, 'D', 7, 'vip', 0),
(72, 2, 'D', 8, 'vip', 0),
(73, 2, 'E', 1, 'vip', 0),
(74, 2, 'E', 2, 'vip', 0),
(75, 2, 'E', 3, 'vip', 0),
(76, 2, 'E', 4, 'vip', 0),
(77, 2, 'E', 5, 'vip', 0),
(78, 2, 'E', 6, 'vip', 0),
(79, 2, 'E', 7, 'vip', 0),
(80, 2, 'E', 8, 'vip', 0),
(81, 3, 'A', 1, 'standard', 0),
(82, 3, 'A', 2, 'standard', 0),
(83, 3, 'A', 3, 'standard', 0),
(84, 3, 'A', 4, 'standard', 0),
(85, 3, 'A', 5, 'standard', 0),
(86, 3, 'A', 6, 'standard', 0),
(87, 3, 'A', 7, 'standard', 0),
(88, 3, 'A', 8, 'standard', 0),
(89, 3, 'B', 1, 'standard', 0),
(90, 3, 'B', 2, 'standard', 0),
(91, 3, 'B', 3, 'standard', 0),
(92, 3, 'B', 4, 'standard', 0),
(93, 3, 'B', 5, 'standard', 0),
(94, 3, 'B', 6, 'standard', 0),
(95, 3, 'B', 7, 'standard', 0),
(96, 3, 'B', 8, 'standard', 0),
(97, 3, 'C', 1, 'standard', 0),
(98, 3, 'C', 2, 'standard', 0),
(99, 3, 'C', 3, 'standard', 0),
(100, 3, 'C', 4, 'standard', 0),
(101, 3, 'C', 5, 'standard', 0),
(102, 3, 'C', 6, 'standard', 0),
(103, 3, 'C', 7, 'standard', 0),
(104, 3, 'C', 8, 'standard', 0),
(105, 3, 'D', 1, 'vip', 0),
(106, 3, 'D', 2, 'vip', 0),
(107, 3, 'D', 3, 'vip', 0),
(108, 3, 'D', 4, 'vip', 0),
(109, 3, 'D', 5, 'vip', 0),
(110, 3, 'D', 6, 'vip', 0),
(111, 3, 'D', 7, 'vip', 0),
(112, 3, 'D', 8, 'vip', 0),
(113, 3, 'E', 1, 'vip', 0),
(114, 3, 'E', 2, 'vip', 0),
(115, 3, 'E', 3, 'vip', 0),
(116, 3, 'E', 4, 'vip', 0),
(117, 3, 'E', 5, 'vip', 0),
(118, 3, 'E', 6, 'vip', 0),
(119, 3, 'E', 7, 'vip', 0),
(120, 3, 'E', 8, 'vip', 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `showtimes`
--

CREATE TABLE `showtimes` (
  `id` int(10) UNSIGNED NOT NULL,
  `movie_id` int(10) UNSIGNED NOT NULL,
  `room_id` int(10) UNSIGNED NOT NULL,
  `start_time` datetime NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `subtitle` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `showtimes`
--

INSERT INTO `showtimes` (`id`, `movie_id`, `room_id`, `start_time`, `price`, `subtitle`, `created_at`) VALUES
(1, 1, 1, '2026-04-01 09:00:00', 90000.00, 'Phụ đề', '2026-03-31 02:39:30'),
(2, 1, 1, '2026-04-01 13:30:00', 120000.00, 'Lồng tiếng', '2026-03-31 02:39:30'),
(3, 2, 2, '2026-04-01 10:00:00', 90000.00, 'Phụ đề', '2026-03-31 02:39:30'),
(4, 2, 2, '2026-04-01 19:30:00', 120000.00, 'Phụ đề', '2026-03-31 02:39:30'),
(5, 3, 1, '2026-04-05 18:00:00', 120000.00, 'Phụ đề', '2026-03-31 02:39:30'),
(6, 4, 3, '2026-04-06 16:00:00', 90000.00, 'Lồng tiếng', '2026-03-31 02:39:30');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','user') NOT NULL DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `password_hash` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `phone`, `address`, `password`, `role`, `created_at`, `password_hash`) VALUES
(2, 'acc clone', 'accclone@gmail.com', '0900000002', 'Tuy Hòa, Phú Yên', '123456', 'user', '2026-03-31 02:39:30', '$2b$10$nGj45S7sakHWruuMwoheL0sxPUxQJHaUxSUcFU0518ub2BJKeuW'),
(4, 'Admin', 'admin123@gmail.com', '0123456789', 'Phú Yên', '', 'admin', '2026-04-02 02:52:46', '$2b$10$HXmEgJ9SMAMMLCSypMURCuXp.PpacM8xZjVImRM7b2CJ/vbs1VA.a'),
(5, 'hello', 'hello@gmail.com', '02131231241', 'Hà Nội', '', 'user', '2026-04-02 04:00:11', '$2b$10$Q.KEY9Dn/FIYYUrxiNe/de0dhnogVIaC9q7rpnlsjRvLxGxOQ8zBO'),
(6, 'Admin', 'admin1@gmail.com', '0123456777', 'Phú Yên', '', 'admin', '2026-04-02 08:44:01', '$2b$10$/AIhGCbtKcJHvrxIYszeAuAuebOwL3bWcyX1BPFmd6SHEOgeS.K.C'),
(7, 'tôi là ai', 'toilaai@gmail.com', NULL, NULL, '123321', 'user', '2026-04-07 03:28:42', NULL),
(8, 'Chu Chu', 'chuchu123@gmail.com', NULL, NULL, '123321', 'user', '2026-04-07 03:35:16', NULL),
(9, 'nunu', 'nunu@gmail.com', '0981253527', 'Thanh Hóa', '', 'user', '2026-04-11 06:49:56', '$2b$10$wSZOwhSYtd9FecNpdlcZ3OlrAsujg0ZXQS9s8LDNSucuMcn0ebir2'),
(10, 'kaka', 'kaka@gmail.com', '076253617', 'Hải Phòng', '', 'user', '2026-04-11 06:50:47', '$2b$10$ApUJJuCvHzBoCn1A8fTHe.PdLUUnAnorFVFlydySqVk4d0DD6tljG');

-- --------------------------------------------------------

--
-- Cấu trúc đóng vai cho view `v_admin_bookings`
-- (See below for the actual view)
--
CREATE TABLE `v_admin_bookings` (
`booking_id` int(10) unsigned
,`total_price` decimal(10,2)
,`status` enum('pending','confirmed','cancelled')
,`created_at` timestamp
,`movie_title` varchar(200)
,`start_time` datetime
,`room_name` varchar(50)
,`user_name` varchar(100)
,`email` varchar(150)
);

-- --------------------------------------------------------

--
-- Cấu trúc đóng vai cho view `v_booking_history`
-- (See below for the actual view)
--
CREATE TABLE `v_booking_history` (
`booking_id` int(10) unsigned
,`total_price` decimal(10,2)
,`status` enum('pending','confirmed','cancelled')
,`created_at` timestamp
,`movie_title` varchar(200)
,`start_time` datetime
,`room_name` varchar(50)
);

-- --------------------------------------------------------

--
-- Cấu trúc cho view `v_admin_bookings`
--
DROP TABLE IF EXISTS `v_admin_bookings`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_admin_bookings`  AS SELECT `b`.`id` AS `booking_id`, `b`.`total_price` AS `total_price`, `b`.`status` AS `status`, `b`.`created_at` AS `created_at`, `m`.`title` AS `movie_title`, `s`.`start_time` AS `start_time`, `r`.`name` AS `room_name`, `u`.`name` AS `user_name`, `b`.`email` AS `email` FROM ((((`bookings` `b` join `showtimes` `s` on(`b`.`showtime_id` = `s`.`id`)) join `movies` `m` on(`s`.`movie_id` = `m`.`id`)) join `rooms` `r` on(`s`.`room_id` = `r`.`id`)) left join `users` `u` on(`b`.`user_id` = `u`.`id`)) ;

-- --------------------------------------------------------

--
-- Cấu trúc cho view `v_booking_history`
--
DROP TABLE IF EXISTS `v_booking_history`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_booking_history`  AS SELECT `b`.`id` AS `booking_id`, `b`.`total_price` AS `total_price`, `b`.`status` AS `status`, `b`.`created_at` AS `created_at`, `m`.`title` AS `movie_title`, `s`.`start_time` AS `start_time`, `r`.`name` AS `room_name` FROM (((`bookings` `b` join `showtimes` `s` on(`b`.`showtime_id` = `s`.`id`)) join `movies` `m` on(`s`.`movie_id` = `m`.`id`)) join `rooms` `r` on(`s`.`room_id` = `r`.`id`)) ;

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_bookings_user_id` (`user_id`),
  ADD KEY `idx_bookings_showtime_id` (`showtime_id`);

--
-- Chỉ mục cho bảng `booking_details`
--
ALTER TABLE `booking_details`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_booking_seat` (`booking_id`,`seat_id`),
  ADD KEY `idx_booking_details_booking_id` (`booking_id`),
  ADD KEY `idx_booking_details_seat_id` (`seat_id`);

--
-- Chỉ mục cho bảng `cinemas`
--
ALTER TABLE `cinemas`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `movies`
--
ALTER TABLE `movies`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `rooms`
--
ALTER TABLE `rooms`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_rooms_cinema_id` (`cinema_id`);

--
-- Chỉ mục cho bảng `seats`
--
ALTER TABLE `seats`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_room_seat` (`room_id`,`row_label`,`col_number`),
  ADD KEY `idx_seats_room_id` (`room_id`);

--
-- Chỉ mục cho bảng `showtimes`
--
ALTER TABLE `showtimes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_showtimes_movie_id` (`movie_id`),
  ADD KEY `idx_showtimes_room_id` (`room_id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_users_email` (`email`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `booking_details`
--
ALTER TABLE `booking_details`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `cinemas`
--
ALTER TABLE `cinemas`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `movies`
--
ALTER TABLE `movies`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `rooms`
--
ALTER TABLE `rooms`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `seats`
--
ALTER TABLE `seats`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=121;

--
-- AUTO_INCREMENT cho bảng `showtimes`
--
ALTER TABLE `showtimes`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `fk_bookings_showtime` FOREIGN KEY (`showtime_id`) REFERENCES `showtimes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_bookings_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `booking_details`
--
ALTER TABLE `booking_details`
  ADD CONSTRAINT `fk_booking_details_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_booking_details_seat` FOREIGN KEY (`seat_id`) REFERENCES `seats` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `rooms`
--
ALTER TABLE `rooms`
  ADD CONSTRAINT `fk_rooms_cinema` FOREIGN KEY (`cinema_id`) REFERENCES `cinemas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `seats`
--
ALTER TABLE `seats`
  ADD CONSTRAINT `fk_seats_room` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `showtimes`
--
ALTER TABLE `showtimes`
  ADD CONSTRAINT `fk_showtimes_movie` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_showtimes_room` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
