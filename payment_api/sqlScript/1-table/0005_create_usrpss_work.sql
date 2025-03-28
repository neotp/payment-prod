CREATE TABLE `usrpss_work` (
  `uswid` int NOT NULL AUTO_INCREMENT,
  `uswusrname` varchar(100) DEFAULT NULL,
  `uswpass` varchar(45) DEFAULT NULL,
  `uswfname` varchar(45) DEFAULT NULL,
  `uswlname` varchar(45) DEFAULT NULL,
  `uswcuscode` varchar(45) DEFAULT NULL,
  `uswcusname` varchar(45) DEFAULT NULL,
  `uswemail` varchar(45) DEFAULT NULL,
  `uswpos` varchar(45) DEFAULT NULL,
  `uswrole` varchar(45) DEFAULT NULL,
  `uswstat` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`uswid`)
) ENGINE=InnoDB AUTO_INCREMENT=87 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
