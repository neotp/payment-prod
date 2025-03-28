USE payment_db;

DELIMITER $$

CREATE PROCEDURE pkgpymnt_send_notes_success(
    IN p_payment       VARCHAR(50),
    OUT p_status       VARCHAR(10)
)
BEGIN

    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET p_status = 'fail';
    END;

    START TRANSACTION;

    SET p_status = 'fail';

    UPDATE pymhdr hdr
    SET hdr.pyhltnotes = 'Y'
    WHERE hdr.pyhpymno = p_payment
      AND hdr.pyhltnotes <> 'Y';

    IF ROW_COUNT() > 0 THEN
        SET p_status = 'success';
    END IF;

    COMMIT;

END $$

DELIMITER ;
