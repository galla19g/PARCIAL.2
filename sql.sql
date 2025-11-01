-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         10.4.32-MariaDB - mariadb.org binary distribution
-- SO del servidor:              Win64
-- HeidiSQL Versión:             12.11.0.7065
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Volcando estructura de base de datos para contactos
CREATE DATABASE IF NOT EXISTS `contactos` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci */;
USE `contactos`;

-- Volcando estructura para tabla contactos.contacto
CREATE TABLE IF NOT EXISTS `contacto` (
  `id_contacto` double NOT NULL AUTO_INCREMENT,
  `primer_nombre` varchar(50) NOT NULL,
  `segundo_nombre` varchar(50) DEFAULT NULL,
  `primer_apellido` varchar(50) NOT NULL,
  `segundo_apellido` varchar(50) DEFAULT NULL,
  `id_genero` int(11) DEFAULT NULL,
  `id_direccion` int(11) DEFAULT NULL,
  `id_tipo_telefono` int(11) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `telefono` varchar(50) DEFAULT NULL,
  `imagen` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id_contacto`),
  KEY `id_genero` (`id_genero`),
  KEY `id_direccion` (`id_direccion`),
  KEY `id_tipo_telefono` (`id_tipo_telefono`),
  CONSTRAINT `contacto_ibfk_1` FOREIGN KEY (`id_genero`) REFERENCES `genero` (`id_genero`),
  CONSTRAINT `contacto_ibfk_2` FOREIGN KEY (`id_direccion`) REFERENCES `direccion` (`id_direccion`),
  CONSTRAINT `contacto_ibfk_3` FOREIGN KEY (`id_tipo_telefono`) REFERENCES `tipo_telefono` (`id_tipo_telefono`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla contactos.direccion
CREATE TABLE IF NOT EXISTS `direccion` (
  `id_direccion` int(11) NOT NULL,
  `detalle_direccion` varchar(50) NOT NULL,
  PRIMARY KEY (`id_direccion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla contactos.genero
CREATE TABLE IF NOT EXISTS `genero` (
  `id_genero` int(11) NOT NULL,
  `detalle_genero` varchar(50) NOT NULL,
  PRIMARY KEY (`id_genero`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla contactos.tipo_telefono
CREATE TABLE IF NOT EXISTS `tipo_telefono` (
  `id_tipo_telefono` int(11) NOT NULL,
  `detalle_tipo_telefono` varchar(50) NOT NULL,
  PRIMARY KEY (`id_tipo_telefono`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- La exportación de datos fue deseleccionada.

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
