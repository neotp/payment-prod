CREATE TABLE `usrhis` (
  `ushid`       INT                 NOT NULL AUTO_INCREMENT,
  `ushusrname`  VARCHAR(45) DEFAULT NULL,
  `ushfname`    VARCHAR(45) DEFAULT NULL,
  `ushlname`    VARCHAR(45) DEFAULT NULL,
  `ushemail`    VARCHAR(45) DEFAULT NULL,
  `ushpos`      VARCHAR(45) DEFAULT NULL,
  PRIMARY KEY (`ushid`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;