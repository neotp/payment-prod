CREATE TABLE `usrpss` (
  `usrid` int NOT NULL AUTO_INCREMENT,
  `usrusrname` varchar(100) DEFAULT NULL,
  `usrpass` varchar(100) DEFAULT NULL,
  `usrcuscode` varchar(100) DEFAULT NULL,
  `usrcusname` varchar(100) DEFAULT NULL,
  `usrrole` varchar(45) DEFAULT NULL,
  `usrstat` varchar(45) DEFAULT NULL COMMENT 'A = approve\n, R = reject\n, D = deleteb\n, P = pending',
  PRIMARY KEY (`usrid`),
  UNIQUE KEY `usrusrname_UNIQUE` (`usrusrname`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
