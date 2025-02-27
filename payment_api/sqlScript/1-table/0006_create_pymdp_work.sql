CREATE TABLE `payment_db`.`pymdp_work` (
  `pywid` INT NOT NULL AUTO_INCREMENT,
  `pywcuscode` VARCHAR(45) NULL,
  `pywdoctype` VARCHAR(45) NULL,
  `pywdocno` VARCHAR(45) NULL,
  `pywdocdate` VARCHAR(45) NULL,
  `pywduedate` VARCHAR(45) NULL,
  `pywdocamt` VARCHAR(45) NULL,
  `pywbalamt` VARCHAR(45) NULL,
  `pywstat` VARCHAR(45) NULL,
  PRIMARY KEY (`pywid`));
