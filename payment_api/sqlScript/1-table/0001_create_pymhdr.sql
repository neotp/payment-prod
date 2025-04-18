CREATE TABLE `pymhdr` (
  `pyhhdrid` int NOT NULL AUTO_INCREMENT,
  `pyhcuscode` varchar(45) DEFAULT NULL,
  `pyhpymno` varchar(45) DEFAULT NULL,
  `pyhsumamt` decimal(15,2) DEFAULT NULL,
  `pyhfeeamt` decimal(15,2) DEFAULT NULL,
  `pyhtotalamt` decimal(15,2) DEFAULT NULL,
  `pyhbank` varchar(45) DEFAULT NULL,
  `pyhcard` varchar(45) DEFAULT NULL,
  `pyhcreusr` varchar(45) DEFAULT NULL,
  `pyhcredate` datetime DEFAULT CURRENT_TIMESTAMP,
  `pyhlink` varchar(250) DEFAULT NULL,
  `pyhcallback` varchar(45) DEFAULT NULL COMMENT 'Y = success, \\\\nN = not success and unknow, \\\\nE = expire',
  `pyhltnotes` varchar(45) DEFAULT NULL COMMENT 'Y = Already send Lotus Notes, \nN = Unalready send Lotus Notes',
  `pyhhtml` text,
  PRIMARY KEY (`pyhhdrid`),
  UNIQUE KEY `pyhpymno_UNIQUE` (`pyhpymno`)
) ENGINE=InnoDB AUTO_INCREMENT=139 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
