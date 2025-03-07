USE payment_db;

DELIMITER $$

CREATE PROCEDURE pkgpymnt_find_data_payment(
    IN p_payment       VARCHAR(50)
)
BEGIN

    SELECT 
        pyh.pyhpymno
        , pyh.pyhsumamt
    FROM pymhdr pyh
    WHERE pyh.pyhpymno = p_payment;

END $$

DELIMITER ;