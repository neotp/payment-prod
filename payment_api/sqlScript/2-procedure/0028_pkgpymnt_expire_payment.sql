USE payment_db;

DELIMITER $$

CREATE PROCEDURE pkgpymnt_expire_payment(
    IN p_payment       VARCHAR(50)
)
BEGIN

    UPDATE pymhdr 
        SET pyhcallback = 'E'
    WHERE pyhpymno = p_cuscode;
    
    UPDATE pymhdr 
        SET pyhcallback = 'E'
    WHERE pyhpymno = p_cuscode;



END $$

DELIMITER ;
