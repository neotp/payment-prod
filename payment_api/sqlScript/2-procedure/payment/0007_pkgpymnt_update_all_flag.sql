DELIMITER $$

CREATE PROCEDURE pkgpymnt_update_all_flag(
    IN p_cuscode       VARCHAR(50)
    , IN p_flag        VARCHAR(50)
)
BEGIN

    UPDATE pymdp_work 
        SET pywflag = p_flag
    WHERE pywcuscode = p_cuscode
    AND pywstat <> 'P'
    AND pywstat <> 'S';

END $$

DELIMITER ;
