CREATE TABLE `usrpss` (
  `usrid`       INT                  NOT NULL AUTO_INCREMENT,
  `usrusrname`  VARCHAR(100) DEFAULT NULL,
  `usrpass`     VARCHAR(100) DEFAULT NULL,
  `usrcuscode`  VARCHAR(100) DEFAULT NULL,
  `usrcusname`  VARCHAR(45)  DEFAULT NULL,
  `usrrole`     VARCHAR(45)  DEFAULT NULL,
  `usrstat`     VARCHAR(45)  DEFAULT NULL,
  PRIMARY KEY (`usrid`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

