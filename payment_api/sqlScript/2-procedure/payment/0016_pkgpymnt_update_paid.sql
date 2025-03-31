USE payment_db;

DELIMITER $$

CREATE PROCEDURE pkgpymnt_update_paid(
    IN p_cuscode       VARCHAR(50)
    , IN p_docno       VARCHAR(10)
    , IN p_paid_amt      VARCHAR(10)
)
BEGIN
    UPDATE pymdp_work 
        SET pywpaidamt = p_paid_amt
    WHERE pywcuscode = p_cuscode
      AND pywdocno = p_docno;
END $$

DELIMITER ;
