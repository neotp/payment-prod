DELIMITER $$

CREATE PROCEDURE pkgpymnt_update_flag(
    IN p_cuscode       VARCHAR(50)
    , IN p_select      Boolean
    , IN p_docno       VARCHAR(10)
)
BEGIN
    UPDATE pymdp_work 
        SET pywflag = p_select
    WHERE pywcuscode = p_cuscode
      AND pywdocno = p_docno;
END $$

DELIMITER ;
