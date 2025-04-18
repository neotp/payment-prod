CREATE TABLE `pymdp_work` (
  `pywid` int NOT NULL AUTO_INCREMENT,
  `pywcuscode` varchar(45) DEFAULT NULL,
  `pywflag` varchar(45) DEFAULT NULL,
  `pywdoctype` varchar(45) DEFAULT NULL,
  `pywdocno` varchar(45) DEFAULT NULL,
  `pywdocdate` date DEFAULT NULL,
  `pywduedate` date DEFAULT NULL,
  `pywdocamt` decimal(15,2) DEFAULT NULL,
  `pywbalamt` decimal(15,2) DEFAULT NULL,
  `pywpaidamt` decimal(15,2) DEFAULT NULL,
  `pywrefdoc` varchar(45) DEFAULT NULL,
  `pywterm` varchar(45) DEFAULT NULL,
  `pywstat` varchar(45) DEFAULT NULL COMMENT 'N = Not yet paid\\nP = Process\\nS = Successed',
  `pywnote` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`pywid`)
) ENGINE=InnoDB AUTO_INCREMENT=20339 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
