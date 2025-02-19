USE payment_db;

DELIMITER $$

DROP PROCEDURE IF EXISTS pymhdr;

CREATE PROCEDURE pymhdr(
    IN p_payment_no     VARCHAR(255),
    IN p_sumamt        VARCHAR(255),
    OUT p_count      VARCHAR(255)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET p_count = 0;
    END;
    START TRANSACTION;
    INSERT INTO pymhdr(
        pyhpymno
        , pyhsumamt
    ) VALUES (
        p_payment_no
        p_sumamt
    );
    COMMIT;
    SET p_count = 1; 
END $$

DELIMITER ;
