USE payment_db;

DELIMITER $$

CREATE PROCEDURE pkgpymnt_update_pymdp_work(
    IN p_cuscode       VARCHAR(50)
)
BEGIN

    UPDATE pymdp_work 
        SET pywstat = 'P'
    WHERE pywcuscode = p_cuscode
    AND pywflag = '1';

END $$

DELIMITER ;
