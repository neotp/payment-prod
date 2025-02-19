CREATE TABLE `pymdtl` (
  `pyddtlid`    INT                   NOT NULL AUTO_INCREMENT,
  `pydhdrid`    INT                   NOT NULL,
  `pydinvno`    VARCHAR(45)   DEFAULT NULL,
  `pyddocamt`   DECIMAL(15,2) DEFAULT NULL,
  `pydbalamt`   DECIMAL(15,2) DEFAULT NULL,
  `pyddocdate`  DATE          DEFAULT NULL,
  `pydduedate`  DATE          DEFAULT NULL,
  `pydstat`     VARCHAR(10)   DEFAULT NULL,
  PRIMARY KEY (`pyddtlid`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
