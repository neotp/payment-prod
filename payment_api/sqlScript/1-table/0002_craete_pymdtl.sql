CREATE TABLE `pymdtl` (
  `pyddtlid` int NOT NULL AUTO_INCREMENT,
  `pydhdrid` int NOT NULL,
  `pydcuscode` varchar(100) DEFAULT NULL,
  `pyddoctype` varchar(45) DEFAULT NULL,
  `pydinvno` varchar(100) DEFAULT NULL,
  `pyddocamt` decimal(15,2) DEFAULT NULL,
  `pydbalamt` decimal(15,2) DEFAULT NULL,
  `pydpaidamt` decimal(15,2) DEFAULT NULL,
  `pyddocdate` date DEFAULT NULL,
  `pydduedate` date DEFAULT NULL,
  `pydrefdoc` varchar(45) DEFAULT NULL,
  `pydterm` varchar(45) DEFAULT NULL,
  `pydstat` varchar(10) DEFAULT NULL,
  `pydnote` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`pyddtlid`)
) ENGINE=InnoDB AUTO_INCREMENT=208 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;