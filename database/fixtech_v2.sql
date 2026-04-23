-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 21, 2026 at 02:02 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `fixtech_v2`
--

-- --------------------------------------------------------

--
-- Table structure for table `attendance`
--

CREATE TABLE `attendance` (
  `id` int(11) NOT NULL,
  `staff_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `status` enum('present','absent','late') NOT NULL DEFAULT 'present'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `attendance`
--

INSERT INTO `attendance` (`id`, `staff_id`, `date`, `status`) VALUES
(1, 2, '2026-03-31', 'present'),
(2, 1, '2026-03-31', 'absent'),
(3, 3, '2026-04-01', 'present'),
(4, 2, '2026-04-01', 'present'),
(7, 1, '2026-04-01', 'present'),
(8, 1, '2026-12-08', 'late');

-- --------------------------------------------------------

--
-- Table structure for table `audit_logs`
--

CREATE TABLE `audit_logs` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `action` varchar(100) NOT NULL,
  `table_name` varchar(100) NOT NULL,
  `record_id` int(11) DEFAULT NULL,
  `details` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`details`)),
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `audit_logs`
--

INSERT INTO `audit_logs` (`id`, `user_id`, `action`, `table_name`, `record_id`, `details`, `timestamp`) VALUES
(1, 1, 'LOGIN', 'users', 1, '{\"ip\":\"127.0.0.1\"}', '2026-03-31 09:19:04'),
(2, 1, 'CREATE', 'staff', 1, '{\"name\":\"NiyonshutiEmery\",\"role\":\"sales\"}', '2026-03-31 09:20:59'),
(3, 1, 'UPDATE', 'staff', 1, '{\"name\":\"NiyonshutiEmery\",\"role\":\"sales\",\"salary\":10000,\"phone\":\"0794382975\",\"hire_date\":\"2026-03-31\"}', '2026-03-31 09:21:36'),
(4, 1, 'CREATE', 'staff', 2, '{\"name\":\"IradukundaTresor\",\"role\":\"staff\"}', '2026-03-31 09:23:33'),
(5, 1, 'ATTENDANCE', 'attendance', 1, '{\"staff_id\":\"2\",\"date\":\"2026-03-31\",\"status\":\"present\"}', '2026-03-31 09:28:50'),
(6, 1, 'ATTENDANCE', 'attendance', 2, '{\"staff_id\":\"1\",\"date\":\"2026-03-31\",\"status\":\"absent\"}', '2026-03-31 09:29:04'),
(7, 1, 'LOGIN', 'users', 1, '{\"ip\":\"127.0.0.1\"}', '2026-03-31 09:30:45'),
(8, 1, 'CREATE', 'products', 1, '{\"name\":\"iphone\",\"quantity\":2}', '2026-03-31 10:30:02'),
(9, 1, 'CREATE', 'products', 2, '{\"name\":\"iphone 16 pro\",\"quantity\":20}', '2026-03-31 10:32:12'),
(10, 1, 'SALE', 'sales', 1, '{\"product_id\":2,\"quantity\":2,\"total_price\":3000000,\"profit\":1000000}', '2026-03-31 10:32:39'),
(11, 1, 'LOGIN', 'users', 1, '{\"ip\":\"127.0.0.1\"}', '2026-03-31 10:46:45'),
(12, 1, 'LOGIN', 'users', 1, '{\"ip\":\"127.0.0.1\"}', '2026-03-31 10:48:54'),
(13, 3, 'LOGIN', 'users', 3, '{\"ip\":\"127.0.0.1\"}', '2026-03-31 10:49:10'),
(14, 4, 'LOGIN', 'users', 4, '{\"ip\":\"127.0.0.1\"}', '2026-03-31 10:52:11'),
(15, 4, 'SALE', 'sales', 2, '{\"product_id\":2,\"quantity\":17,\"total_price\":25500000,\"profit\":8500000}', '2026-03-31 10:54:17'),
(16, 4, 'SALE', 'sales', 3, '{\"product_id\":1,\"quantity\":2,\"total_price\":2400000,\"profit\":400000}', '2026-03-31 10:55:18'),
(17, 4, 'SALE', 'sales', 4, '{\"product_id\":2,\"quantity\":1,\"total_price\":1500000,\"profit\":500000}', '2026-03-31 10:55:32'),
(18, 4, 'LOGIN', 'users', 4, '{\"ip\":\"127.0.0.1\"}', '2026-04-01 08:04:42'),
(19, 3, 'LOGIN', 'users', 3, '{\"ip\":\"127.0.0.1\"}', '2026-04-01 08:05:09'),
(20, 3, 'CREATE', 'products', 3, '{\"name\":\"lenovo laptop\",\"quantity\":200}', '2026-04-01 08:07:32'),
(21, 3, 'UPDATE', 'products', 2, '{\"name\":\"iphone 16 pro\",\"quantity\":300}', '2026-04-01 08:07:56'),
(22, 3, 'UPDATE', 'products', 1, '{\"name\":\"iPhone 15 pro\",\"quantity\":100}', '2026-04-01 08:08:31'),
(23, 3, 'UPDATE', 'products', 2, '{\"name\":\"iphone 16 pro\",\"quantity\":300}', '2026-04-01 08:08:53'),
(24, 3, 'CREATE', 'products', 4, '{\"name\":\"oppo A57\",\"quantity\":159}', '2026-04-01 09:43:26'),
(25, 3, 'CREATE', 'staff', 3, '{\"name\":\"DUSHIME Method\",\"role\":\"ACOUNTANT\"}', '2026-04-01 09:45:25'),
(26, 3, 'CREATE', 'staff', 4, '{\"name\":\"KIMOZELLA\",\"role\":\"ADVATISEMENT\"}', '2026-04-01 09:46:49'),
(27, 3, 'CREATE', 'staff', 5, '{\"name\":\"KIZZ PRENSE\",\"role\":\"SUPPLIER\"}', '2026-04-01 09:47:56'),
(28, 3, 'ATTENDANCE', 'attendance', 3, '{\"staff_id\":\"3\",\"date\":\"2026-04-01\",\"status\":\"present\"}', '2026-04-01 10:59:18'),
(29, 3, 'ATTENDANCE', 'attendance', 4, '{\"staff_id\":\"2\",\"date\":\"2026-04-01\",\"status\":\"present\"}', '2026-04-01 10:59:27'),
(30, 3, 'ATTENDANCE', 'attendance', 5, '{\"staff_id\":\"4\",\"date\":\"2026-04-01\",\"status\":\"present\"}', '2026-04-01 10:59:39'),
(31, 3, 'ATTENDANCE', 'attendance', 6, '{\"staff_id\":\"5\",\"date\":\"2026-04-01\",\"status\":\"late\"}', '2026-04-01 11:00:03'),
(32, 3, 'ATTENDANCE', 'attendance', 7, '{\"staff_id\":\"1\",\"date\":\"2026-04-01\",\"status\":\"present\"}', '2026-04-01 11:00:15'),
(33, 3, 'CREATE', 'expenses', 1, '{\"description\":\"rent of house we live in\",\"amount\":1000}', '2026-04-02 07:12:36'),
(34, 3, 'CREATE', 'expenses', 2, '{\"description\":\"saupplies\",\"amount\":1000}', '2026-04-02 07:13:22'),
(35, 1, 'LOGIN', 'users', 1, '{\"ip\":\"127.0.0.1\"}', '2026-04-03 10:31:04'),
(36, 1, 'SALE', 'sales', 5, '{\"product_id\":4,\"quantity\":1,\"total_price\":30000,\"profit\":15000}', '2026-04-08 09:23:18'),
(37, 1, 'ATTENDANCE', 'attendance', 8, '{\"staff_id\":\"1\",\"date\":\"2026-12-08\",\"status\":\"late\"}', '2026-04-08 09:34:11'),
(38, 1, 'LOGIN', 'users', 1, '{\"ip\":\"127.0.0.1\"}', '2026-04-08 09:36:35'),
(39, 1, 'LOGIN', 'users', 1, '{\"ip\":\"127.0.0.1\"}', '2026-04-14 09:27:51'),
(40, 1, 'LOGIN', 'users', 1, '{\"ip\":\"127.0.0.1\"}', '2026-04-14 09:41:11'),
(41, 1, 'LOGIN', 'users', 1, '{\"ip\":\"127.0.0.1\"}', '2026-04-17 07:45:06'),
(42, 1, 'ATTENDANCE', 'attendance', 9, '{\"staff_id\":\"5\",\"date\":\"2026-04-17\",\"status\":\"absent\"}', '2026-04-17 07:54:19'),
(43, 1, 'UPDATE', 'staff', 1, '{\"name\":\"NiyonshutiEmery\",\"role\":\"CEO\",\"salary\":1000000,\"phone\":\"0794382975\",\"hire_date\":\"2026-03-31\"}', '2026-04-17 07:55:02'),
(44, 1, 'LOGIN', 'users', 1, '{\"ip\":\"127.0.0.1\"}', '2026-04-17 12:19:32'),
(45, 1, 'LOGIN', 'users', 1, '{\"ip\":\"127.0.0.1\"}', '2026-04-17 12:21:11'),
(46, 1, 'LOGIN', 'users', 1, '{\"ip\":\"127.0.0.1\"}', '2026-04-17 12:27:23'),
(47, 1, 'UPDATE', 'staff', 4, '{\"name\":\"KIMOZELLA allex\",\"role\":\"ADVATISEMENT\",\"salary\":50000,\"phone\":\"0785634875\",\"hire_date\":\"2026-04-01\"}', '2026-04-21 07:24:27'),
(48, 1, 'DELETE', 'staff', 4, NULL, '2026-04-21 07:24:39'),
(49, 1, 'DELETE', 'staff', 5, NULL, '2026-04-21 07:38:31');

-- --------------------------------------------------------

--
-- Table structure for table `customer_requests`
--

CREATE TABLE `customer_requests` (
  `id` int(11) NOT NULL,
  `request_type` enum('buy','repair','delivery','support') NOT NULL,
  `name` varchar(100) NOT NULL,
  `phone` varchar(30) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `product_name` varchar(255) DEFAULT NULL,
  `is_custom_product` tinyint(1) DEFAULT 0,
  `quantity` int(11) DEFAULT 1,
  `location` varchar(255) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `status` enum('pending','processing','approved','rejected','completed') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `expenses`
--

CREATE TABLE `expenses` (
  `id` int(11) NOT NULL,
  `description` varchar(255) NOT NULL,
  `amount` decimal(12,2) NOT NULL CHECK (`amount` > 0),
  `category` varchar(100) NOT NULL DEFAULT 'General',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `expenses`
--

INSERT INTO `expenses` (`id`, `description`, `amount`, `category`, `created_at`) VALUES
(1, 'rent of house we live in', 1000.00, 'Rent', '2026-04-02 07:12:36'),
(2, 'saupplies', 1000.00, 'Supplies', '2026-04-02 07:13:22');

-- --------------------------------------------------------

--
-- Table structure for table `login_activity`
--

CREATE TABLE `login_activity` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `logged_in_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `login_activity`
--

INSERT INTO `login_activity` (`id`, `user_id`, `ip_address`, `logged_in_at`) VALUES
(1, 1, '127.0.0.1', '2026-03-31 09:19:04'),
(2, 1, '127.0.0.1', '2026-03-31 09:30:45'),
(3, 1, '127.0.0.1', '2026-03-31 10:46:45'),
(4, 1, '127.0.0.1', '2026-03-31 10:48:54'),
(5, 3, '127.0.0.1', '2026-03-31 10:49:10'),
(6, 4, '127.0.0.1', '2026-03-31 10:52:11'),
(7, 4, '127.0.0.1', '2026-04-01 08:04:42'),
(8, 3, '127.0.0.1', '2026-04-01 08:05:09'),
(9, 1, '127.0.0.1', '2026-04-03 10:31:04'),
(10, 1, '127.0.0.1', '2026-04-08 09:36:35'),
(11, 1, '127.0.0.1', '2026-04-14 09:27:51'),
(12, 1, '127.0.0.1', '2026-04-14 09:41:11'),
(13, 1, '127.0.0.1', '2026-04-17 07:45:06'),
(14, 1, '127.0.0.1', '2026-04-17 12:19:32'),
(15, 1, '127.0.0.1', '2026-04-17 12:21:11'),
(16, 1, '127.0.0.1', '2026-04-17 12:27:23');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `category` varchar(100) NOT NULL,
  `brand` varchar(100) DEFAULT NULL,
  `purchase_price` decimal(12,2) NOT NULL CHECK (`purchase_price` >= 0),
  `selling_price` decimal(12,2) NOT NULL CHECK (`selling_price` >= 0),
  `quantity` int(11) NOT NULL DEFAULT 0 CHECK (`quantity` >= 0),
  `supplier` varchar(200) DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `category`, `brand`, `purchase_price`, `selling_price`, `quantity`, `supplier`, `is_deleted`, `created_at`) VALUES
(1, 'iPhone 15 pro', 'iphone 15 pro', 'iphone', 1000000.00, 1200000.00, 100, 'kimo_l.t.d', 0, '2026-03-31 10:30:02'),
(2, 'iphone 16 pro', 'iphone 16 pro', 'iphone', 1000000.00, 1500000.00, 300, 'kimo_l.t.d', 0, '2026-03-31 10:32:12'),
(3, 'lenovo laptop', 'laptops', 'lenovo', 300000.00, 500000.00, 200, 'KiMo l.t.d', 0, '2026-04-01 08:07:32'),
(4, 'oppo A57', 'oppo_phones', 'oppo', 15000.00, 30000.00, 158, 'oppoL.T.D', 0, '2026-04-01 09:43:26');

-- --------------------------------------------------------

--
-- Table structure for table `refresh_tokens`
--

CREATE TABLE `refresh_tokens` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `token` varchar(512) NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `refresh_tokens`
--

INSERT INTO `refresh_tokens` (`id`, `user_id`, `token`, `expires_at`, `created_at`) VALUES
(11, 1, '12babd45-88bd-4214-be22-993fc10bd13a', '2026-04-08 08:33:40', '2026-04-01 08:33:40'),
(16, 3, '98ef86ac-f72f-4117-a4ab-19e8a576d68f', '2026-04-09 07:10:57', '2026-04-02 07:10:57'),
(22, 1, '55abe3b1-fcdc-465f-a211-87032b5f7f47', '2026-04-21 09:41:11', '2026-04-14 09:41:11'),
(32, 1, 'cb78adf8-bdd3-45b0-886e-68addd104338', '2026-04-28 08:09:32', '2026-04-21 08:09:32'),
(33, 1, '938398c5-23f0-4bb6-abe7-a5d7209ca7ca', '2026-04-28 09:54:44', '2026-04-21 09:54:44'),
(34, 1, 'a80609b6-0a8a-498b-8e83-79273296dbd4', '2026-04-28 10:07:00', '2026-04-21 10:07:00');

-- --------------------------------------------------------

--
-- Table structure for table `requests`
--

CREATE TABLE `requests` (
  `id` int(11) NOT NULL,
  `request_type` enum('buy','repair','delivery','support') NOT NULL,
  `name` varchar(100) NOT NULL,
  `phone` varchar(30) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `product_name` varchar(255) DEFAULT NULL,
  `is_custom_product` tinyint(1) DEFAULT 0,
  `quantity` int(11) DEFAULT 1,
  `location` varchar(255) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `status` enum('pending','processing','approved','rejected','completed') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_read` tinyint(1) DEFAULT 0,
  `assigned_to` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `requests`
--

INSERT INTO `requests` (`id`, `request_type`, `name`, `phone`, `product_id`, `product_name`, `is_custom_product`, `quantity`, `location`, `message`, `status`, `created_at`, `is_read`, `assigned_to`) VALUES
(1, 'buy', 'emmery', '0792631601', 1, 'iPhone 15 pro', 0, 1, NULL, 'new one', 'pending', '2026-04-17 10:24:18', 0, NULL),
(2, 'support', 'emmery', '0792631601', NULL, NULL, 0, 1, NULL, 'fix my laptop', 'pending', '2026-04-17 12:29:10', 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `sales`
--

CREATE TABLE `sales` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL CHECK (`quantity` > 0),
  `total_price` decimal(12,2) NOT NULL,
  `profit` decimal(12,2) NOT NULL,
  `sold_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sales`
--

INSERT INTO `sales` (`id`, `product_id`, `quantity`, `total_price`, `profit`, `sold_by`, `created_at`) VALUES
(1, 2, 2, 3000000.00, 1000000.00, 1, '2026-03-31 10:32:39'),
(2, 2, 17, 25500000.00, 8500000.00, 4, '2026-03-31 10:54:17'),
(3, 1, 2, 2400000.00, 400000.00, 4, '2026-03-31 10:55:18'),
(4, 2, 1, 1500000.00, 500000.00, 4, '2026-03-31 10:55:32'),
(5, 4, 1, 30000.00, 15000.00, 1, '2026-04-08 09:23:18');

-- --------------------------------------------------------

--
-- Table structure for table `staff`
--

CREATE TABLE `staff` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `role` varchar(100) NOT NULL,
  `salary` decimal(12,2) NOT NULL DEFAULT 0.00,
  `phone` varchar(20) DEFAULT NULL,
  `hire_date` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `staff`
--

INSERT INTO `staff` (`id`, `name`, `role`, `salary`, `phone`, `hire_date`, `created_at`) VALUES
(1, 'NiyonshutiEmery', 'CEO', 1000000.00, '0794382975', '2026-03-31', '2026-03-31 09:20:59'),
(2, 'IradukundaTresor', 'staff', 1000000.00, '0792631601', '2026-03-31', '2026-03-31 09:23:33'),
(3, 'DUSHIME Method', 'ACOUNTANT', 100000.00, '0783928523', '2026-04-01', '2026-04-01 09:45:25');

-- --------------------------------------------------------

--
-- Table structure for table `stock_history`
--

CREATE TABLE `stock_history` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `change_type` enum('sale','restock','edit','delete') NOT NULL,
  `quantity_changed` int(11) NOT NULL,
  `previous_quantity` int(11) NOT NULL,
  `new_quantity` int(11) NOT NULL,
  `changed_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `stock_history`
--

INSERT INTO `stock_history` (`id`, `product_id`, `change_type`, `quantity_changed`, `previous_quantity`, `new_quantity`, `changed_by`, `created_at`) VALUES
(1, 2, 'sale', -2, 20, 18, 1, '2026-03-31 10:32:39'),
(2, 2, 'sale', -17, 18, 1, 4, '2026-03-31 10:54:17'),
(3, 1, 'sale', -2, 2, 0, 4, '2026-03-31 10:55:18'),
(4, 2, 'sale', -1, 1, 0, 4, '2026-03-31 10:55:32'),
(5, 2, 'edit', 300, 0, 300, 3, '2026-04-01 08:07:56'),
(6, 1, 'edit', 100, 0, 100, 3, '2026-04-01 08:08:31'),
(7, 4, 'sale', -1, 159, 158, 1, '2026-04-08 09:23:18');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','staff') NOT NULL DEFAULT 'staff',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `role`, `created_at`) VALUES
(1, 'loganmullahh', '$2b$12$dRzU9R0440.tKCmKzUncluvzbSPE9n5s8OATEdtpRY23yzgPxQHsm', 'admin', '2026-03-31 09:02:46'),
(3, 'NiyonshutiEmery', '$2b$12$Jz9en21pH0Gf5JGweasIHutNs/L2DWBmc3.Lv/dISDAIkZ4utCMDq', 'admin', '2026-03-31 10:46:08'),
(4, 'tresor', '$2b$12$1BjL8uYcY3/HJTfaRptBdeFaLvDhc1YMW163L.or5WbY0tSHozUg2', 'staff', '2026-03-31 10:51:44');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `attendance`
--
ALTER TABLE `attendance`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_attendance` (`staff_id`,`date`),
  ADD KEY `idx_staff_id` (`staff_id`),
  ADD KEY `idx_date` (`date`);

--
-- Indexes for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_table_name` (`table_name`),
  ADD KEY `idx_timestamp` (`timestamp`);

--
-- Indexes for table `customer_requests`
--
ALTER TABLE `customer_requests`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `expenses`
--
ALTER TABLE `expenses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_category` (`category`),
  ADD KEY `idx_created_at` (`created_at`);

--
-- Indexes for table `login_activity`
--
ALTER TABLE `login_activity`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_id` (`user_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_category` (`category`),
  ADD KEY `idx_quantity` (`quantity`),
  ADD KEY `idx_is_deleted` (`is_deleted`);

--
-- Indexes for table `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `token` (`token`),
  ADD KEY `idx_token` (`token`),
  ADD KEY `idx_user_id` (`user_id`);

--
-- Indexes for table `requests`
--
ALTER TABLE `requests`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sales`
--
ALTER TABLE `sales`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_product_id` (`product_id`),
  ADD KEY `idx_sold_by` (`sold_by`),
  ADD KEY `idx_created_at` (`created_at`);

--
-- Indexes for table `staff`
--
ALTER TABLE `staff`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_name` (`name`);

--
-- Indexes for table `stock_history`
--
ALTER TABLE `stock_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_product_id` (`product_id`),
  ADD KEY `idx_changed_by` (`changed_by`),
  ADD KEY `idx_created_at` (`created_at`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD KEY `idx_username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `attendance`
--
ALTER TABLE `attendance`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `audit_logs`
--
ALTER TABLE `audit_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT for table `customer_requests`
--
ALTER TABLE `customer_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `expenses`
--
ALTER TABLE `expenses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `login_activity`
--
ALTER TABLE `login_activity`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `requests`
--
ALTER TABLE `requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `sales`
--
ALTER TABLE `sales`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `staff`
--
ALTER TABLE `staff`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `stock_history`
--
ALTER TABLE `stock_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `attendance`
--
ALTER TABLE `attendance`
  ADD CONSTRAINT `attendance_ibfk_1` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD CONSTRAINT `audit_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `login_activity`
--
ALTER TABLE `login_activity`
  ADD CONSTRAINT `login_activity_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  ADD CONSTRAINT `refresh_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sales`
--
ALTER TABLE `sales`
  ADD CONSTRAINT `sales_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  ADD CONSTRAINT `sales_ibfk_2` FOREIGN KEY (`sold_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `stock_history`
--
ALTER TABLE `stock_history`
  ADD CONSTRAINT `stock_history_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `stock_history_ibfk_2` FOREIGN KEY (`changed_by`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
