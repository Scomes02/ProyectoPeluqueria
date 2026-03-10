-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: peluqueria_db
-- ------------------------------------------------------
-- Server version	8.0.41

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
-- Table structure for table `detalle_cierres`
--

DROP TABLE IF EXISTS `detalle_cierres`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detalle_cierres` (
  `id_detalle` int NOT NULL AUTO_INCREMENT,
  `id_cierre` int DEFAULT NULL,
  `id_peluquero` int DEFAULT NULL,
  `total_generado` decimal(10,2) NOT NULL,
  `pago_peluquero` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id_detalle`),
  KEY `id_cierre` (`id_cierre`),
  KEY `id_peluquero` (`id_peluquero`),
  CONSTRAINT `detalle_cierres_ibfk_1` FOREIGN KEY (`id_cierre`) REFERENCES `historial_cajas` (`id_cierre`),
  CONSTRAINT `detalle_cierres_ibfk_2` FOREIGN KEY (`id_peluquero`) REFERENCES `peluqueros` (`id_peluquero`)
) ENGINE=InnoDB AUTO_INCREMENT=83 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detalle_cierres`
--

LOCK TABLES `detalle_cierres` WRITE;
/*!40000 ALTER TABLE `detalle_cierres` DISABLE KEYS */;
INSERT INTO `detalle_cierres` VALUES (1,7,1,37000.00,29600.00),(2,7,2,27500.00,22000.00),(3,7,3,30000.00,24000.00),(4,7,4,50000.00,40000.00),(5,7,5,89000.00,71200.00),(6,7,6,38000.00,30400.00),(7,7,7,85000.00,68000.00),(8,7,8,143000.00,114400.00),(9,8,2,16000.00,12800.00),(10,8,5,43000.00,34400.00),(11,8,6,35500.00,28400.00),(12,8,8,84000.00,67200.00),(13,9,1,60000.00,48000.00),(14,9,2,35000.00,28000.00),(15,9,4,45000.00,36000.00),(16,10,1,80000.00,64000.00),(17,10,2,45000.00,36000.00),(18,10,4,50000.00,40000.00),(19,10,6,35000.00,28000.00),(20,11,1,75000.00,60000.00),(21,11,4,55000.00,44000.00),(22,11,6,35000.00,28000.00),(23,12,1,90000.00,72000.00),(24,12,2,50000.00,40000.00),(25,12,4,60000.00,48000.00),(26,12,6,30000.00,24000.00),(27,13,1,110000.00,88000.00),(28,13,2,60000.00,48000.00),(29,13,4,85000.00,68000.00),(30,13,6,50000.00,40000.00),(31,14,1,105000.00,84000.00),(32,14,2,55000.00,44000.00),(33,14,4,75000.00,60000.00),(34,14,6,55000.00,44000.00),(35,15,1,50000.00,40000.00),(36,15,2,20000.00,16000.00),(37,15,6,25000.00,20000.00),(38,16,1,60000.00,48000.00),(39,16,4,35000.00,28000.00),(40,16,6,20000.00,16000.00),(41,17,1,65000.00,52000.00),(42,17,4,40000.00,32000.00),(43,17,6,30000.00,24000.00),(44,18,1,70000.00,56000.00),(45,18,2,30000.00,24000.00),(46,18,4,50000.00,40000.00),(47,18,6,35000.00,28000.00),(48,19,1,65000.00,52000.00),(49,19,2,25000.00,20000.00),(50,19,4,60000.00,48000.00),(51,20,1,75000.00,60000.00),(52,20,2,35000.00,28000.00),(53,20,4,50000.00,40000.00),(54,21,1,80000.00,64000.00),(55,21,2,40000.00,32000.00),(56,21,4,45000.00,36000.00),(57,21,6,25000.00,20000.00),(58,22,1,85000.00,68000.00),(59,22,2,45000.00,36000.00),(60,22,4,60000.00,48000.00),(61,22,6,40000.00,32000.00),(62,23,1,60000.00,48000.00),(63,23,4,40000.00,32000.00),(64,23,6,25000.00,20000.00),(65,24,1,75000.00,60000.00),(66,24,2,35000.00,28000.00),(67,24,4,50000.00,40000.00),(68,24,6,20000.00,16000.00),(69,25,1,45000.00,36000.00),(70,25,4,35000.00,28000.00),(71,26,1,65000.00,52000.00),(72,26,2,35000.00,28000.00),(73,26,4,50000.00,40000.00),(74,27,1,75000.00,60000.00),(75,27,2,40000.00,32000.00),(76,27,4,55000.00,44000.00),(77,27,6,30000.00,24000.00),(78,28,1,40000.00,32000.00),(79,28,2,25000.00,20000.00),(80,29,1,55000.00,44000.00),(81,29,4,35000.00,28000.00),(82,29,6,20000.00,16000.00);
/*!40000 ALTER TABLE `detalle_cierres` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historial_cajas`
--

DROP TABLE IF EXISTS `historial_cajas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historial_cajas` (
  `id_cierre` int NOT NULL AUTO_INCREMENT,
  `fecha` datetime DEFAULT CURRENT_TIMESTAMP,
  `total_bruto` decimal(10,2) NOT NULL,
  `ganancia_local` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id_cierre`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historial_cajas`
--

LOCK TABLES `historial_cajas` WRITE;
/*!40000 ALTER TABLE `historial_cajas` DISABLE KEYS */;
INSERT INTO `historial_cajas` VALUES (7,'2026-03-10 17:14:09',499500.00,99900.00),(8,'2026-03-10 17:22:03',178500.00,35700.00),(9,'2025-12-05 13:30:00',140000.00,28000.00),(10,'2025-12-06 14:00:00',210000.00,42000.00),(11,'2025-12-12 13:45:00',165000.00,33000.00),(12,'2025-12-13 14:15:00',230000.00,46000.00),(13,'2025-12-24 15:00:00',305000.00,61000.00),(14,'2025-12-31 14:45:00',290000.00,58000.00),(15,'2026-01-03 14:00:00',95000.00,19000.00),(16,'2026-01-09 13:30:00',115000.00,23000.00),(17,'2026-01-10 14:10:00',135000.00,27000.00),(18,'2026-01-17 14:00:00',185000.00,37000.00),(19,'2026-01-24 14:20:00',150000.00,30000.00),(20,'2026-02-06 13:45:00',160000.00,32000.00),(21,'2026-02-07 14:15:00',190000.00,38000.00),(22,'2026-02-14 14:30:00',230000.00,46000.00),(23,'2026-02-20 13:30:00',125000.00,25000.00),(24,'2026-02-28 14:10:00',180000.00,36000.00),(25,'2026-03-02 13:45:00',80000.00,16000.00),(26,'2026-03-06 14:00:00',150000.00,30000.00),(27,'2026-03-07 14:30:00',200000.00,40000.00),(28,'2026-03-09 13:30:00',65000.00,13000.00),(29,'2026-03-10 14:00:00',110000.00,22000.00);
/*!40000 ALTER TABLE `historial_cajas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `peluqueros`
--

DROP TABLE IF EXISTS `peluqueros`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `peluqueros` (
  `id_peluquero` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `estado` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id_peluquero`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `peluqueros`
--

LOCK TABLES `peluqueros` WRITE;
/*!40000 ALTER TABLE `peluqueros` DISABLE KEYS */;
INSERT INTO `peluqueros` VALUES (1,'Juan',0),(2,'Lucas',1),(3,'lucas',0),(4,'Pedro',0),(5,'Juan',1),(6,'Patri',1),(7,'Juan',0),(8,'Ricardo',1);
/*!40000 ALTER TABLE `peluqueros` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productos_proveedor`
--

DROP TABLE IF EXISTS `productos_proveedor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productos_proveedor` (
  `id_producto` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  `icono` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id_producto`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productos_proveedor`
--

LOCK TABLES `productos_proveedor` WRITE;
/*!40000 ALTER TABLE `productos_proveedor` DISABLE KEYS */;
INSERT INTO `productos_proveedor` VALUES (1,'Shampoo Neutro 5L',15000.00,'fa-bottle-water'),(2,'Caja Navajas x100',6000.00,'fa-cut'),(3,'Acondicionador Neutro 5L',15000.00,'fa-bottle-water'),(4,'Repuestos Maquinita x100',6000.00,'fa-cut');
/*!40000 ALTER TABLE `productos_proveedor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `servicios`
--

DROP TABLE IF EXISTS `servicios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `servicios` (
  `id_servicio` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id_servicio`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `servicios`
--

LOCK TABLES `servicios` WRITE;
/*!40000 ALTER TABLE `servicios` DISABLE KEYS */;
INSERT INTO `servicios` VALUES (6,'Corte',8000.00),(7,'Color',15000.00),(8,'Barba',6500.00),(9,'Niños',6500.00);
/*!40000 ALTER TABLE `servicios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `rol` enum('admin','staff') NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'admin','admin123','admin'),(2,'staff','staff123','staff');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'peluqueria_db'
--

--
-- Dumping routines for database 'peluqueria_db'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-10 17:54:44
