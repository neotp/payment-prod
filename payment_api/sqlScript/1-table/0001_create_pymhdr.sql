CREATE TABLE `pymhdr` (
  `pyhhdrid`    INT                     NOT NULL AUTO_INCREMENT,
  `pyhcuscode`  VARCHAR(45)   DEFAULT   NULL,
  `pyhpymno`    VARCHAR(45)   DEFAULT   NULL,
  `pyhsumamt`   DECIMAL(15,2) DEFAULT   NULL,
  `pyhcredate`  DATETIME      DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`pyhhdrid`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
