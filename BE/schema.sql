-- MySQL dump 10.13  Distrib 8.0.39, for Win64 (x86_64)
--
-- Host: localhost    Database: truck_management
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cities`
--

DROP TABLE IF EXISTS `cities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cities` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `country` varchar(255) DEFAULT NULL,
  `created_at` bigint NOT NULL,
  `latitude` double DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKl61tawv0e2a93es77jkyvi7qa` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `deliver_alerts`
--

DROP TABLE IF EXISTS `deliver_alerts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `deliver_alerts` (
  `id` varchar(255) NOT NULL,
  `created_at` bigint NOT NULL,
  `message` varchar(255) DEFAULT NULL,
  `type` enum('CANCELED','DELIVERY_COMPLETED','GPS_LOST','IDLE_OUTSIDE_ALLOWED_AREA','ILLEGAL_STOP','ROUTE_DEVIATION','TRANSIT','UNAUTHORIZED_UNLOADING') DEFAULT NULL,
  `delivery_id` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK7rrbju6x70f8qglkig91p05r5` (`delivery_id`),
  CONSTRAINT `FK7rrbju6x70f8qglkig91p05r5` FOREIGN KEY (`delivery_id`) REFERENCES `deliveries` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `deliveries`
--

DROP TABLE IF EXISTS `deliveries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `deliveries` (
  `id` varchar(255) NOT NULL,
  `finished_at` bigint DEFAULT NULL,
  `started_at` bigint NOT NULL,
  `add_by_operator_id` varchar(255) DEFAULT NULL,
  `route_id` varchar(255) DEFAULT NULL,
  `truck_id` varchar(255) DEFAULT NULL,
  `worker_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKsuh51dobyvhej4eb0rd0v3skl` (`add_by_operator_id`),
  KEY `FKsr9655vvbw7n7qjhlr2dnw447` (`route_id`),
  KEY `FK3vdabk4hy718f9lw5joh7hofu` (`truck_id`),
  KEY `FK9qvmtdwmb2wrt9uokw97h0tsf` (`worker_id`),
  CONSTRAINT `FK3vdabk4hy718f9lw5joh7hofu` FOREIGN KEY (`truck_id`) REFERENCES `trucks` (`id`),
  CONSTRAINT `FK9qvmtdwmb2wrt9uokw97h0tsf` FOREIGN KEY (`worker_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKsr9655vvbw7n7qjhlr2dnw447` FOREIGN KEY (`route_id`) REFERENCES `routes` (`id`),
  CONSTRAINT `FKsuh51dobyvhej4eb0rd0v3skl` FOREIGN KEY (`add_by_operator_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `delivery_transits`
--

DROP TABLE IF EXISTS `delivery_transits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `delivery_transits` (
  `id` varchar(255) NOT NULL,
  `actioned_at` bigint DEFAULT NULL,
  `arrived_at` bigint NOT NULL,
  `is_accepted` bit(1) DEFAULT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `action_by_operator_id` varchar(255) DEFAULT NULL,
  `delivery_id` varchar(255) DEFAULT NULL,
  `transit_point_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK3lqxvao8anywo1nlk56jolp8t` (`action_by_operator_id`),
  KEY `FKiq8emhjbehhq7ky4raafraejl` (`delivery_id`),
  KEY `FK4bawncgmmfq5xl310v28kamau` (`transit_point_id`),
  CONSTRAINT `FK3lqxvao8anywo1nlk56jolp8t` FOREIGN KEY (`action_by_operator_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FK4bawncgmmfq5xl310v28kamau` FOREIGN KEY (`transit_point_id`) REFERENCES `transit_points` (`id`),
  CONSTRAINT `FKiq8emhjbehhq7ky4raafraejl` FOREIGN KEY (`delivery_id`) REFERENCES `deliveries` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `positions`
--

DROP TABLE IF EXISTS `positions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `positions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `latitude` double DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  `recorded_at` bigint NOT NULL,
  `delivery_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKhosicwu2b3kblxu0fimpy61q9` (`delivery_id`),
  CONSTRAINT `FKhosicwu2b3kblxu0fimpy61q9` FOREIGN KEY (`delivery_id`) REFERENCES `deliveries` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `routes`
--

DROP TABLE IF EXISTS `routes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `routes` (
  `id` varchar(255) NOT NULL,
  `base_price` double DEFAULT NULL,
  `cargo_type` varchar(255) DEFAULT NULL,
  `created_at` bigint NOT NULL,
  `details` varchar(255) DEFAULT NULL,
  `distancekm` double DEFAULT NULL,
  `estimated_duration_hours` double DEFAULT NULL,
  `is_active` bit(1) NOT NULL,
  `end_id` bigint NOT NULL,
  `start_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKe5xobsfbsva5uqc2ns8kgj9ft` (`end_id`),
  KEY `FKlwysqyu1d1232gnka4jbreumf` (`start_id`),
  CONSTRAINT `FKe5xobsfbsva5uqc2ns8kgj9ft` FOREIGN KEY (`end_id`) REFERENCES `cities` (`id`),
  CONSTRAINT `FKlwysqyu1d1232gnka4jbreumf` FOREIGN KEY (`start_id`) REFERENCES `cities` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `transit_points`
--

DROP TABLE IF EXISTS `transit_points`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transit_points` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `cargo_type` varchar(255) DEFAULT NULL,
  `created_at` bigint NOT NULL,
  `estimated_duration_minute` bigint DEFAULT NULL,
  `extra_cost` double DEFAULT NULL,
  `is_active` bit(1) NOT NULL,
  `loading_city_id` bigint NOT NULL,
  `unloading_city_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKgw5etec92dm58tuk5db9a9k5v` (`loading_city_id`),
  KEY `FKllhn4uytebb5m7kj6468yaem8` (`unloading_city_id`),
  CONSTRAINT `FKgw5etec92dm58tuk5db9a9k5v` FOREIGN KEY (`loading_city_id`) REFERENCES `cities` (`id`),
  CONSTRAINT `FKllhn4uytebb5m7kj6468yaem8` FOREIGN KEY (`unloading_city_id`) REFERENCES `cities` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `trucks`
--

DROP TABLE IF EXISTS `trucks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `trucks` (
  `id` varchar(255) NOT NULL,
  `capacitykg` double NOT NULL,
  `cargo_type` varchar(255) DEFAULT NULL,
  `deleted_at` bigint DEFAULT NULL,
  `is_available` bit(1) DEFAULT NULL,
  `license_plate` varchar(255) NOT NULL,
  `model` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK52vgej5a85tewppbw8vd02feo` (`license_plate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` varchar(255) NOT NULL,
  `age` bigint NOT NULL,
  `created_at` bigint NOT NULL,
  `deleted_at` bigint DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone_number` varchar(255) NOT NULL,
  `refresh_token` varchar(255) DEFAULT NULL,
  `role` enum('ADMIN','DRIVER','MODERATOR','OWNER') NOT NULL,
  `updated_at` bigint DEFAULT NULL,
  `username` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`),
  UNIQUE KEY `UKr43af9ap4edm43mmtq01oddj6` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-09  7:56:58
