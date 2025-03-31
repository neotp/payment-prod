USE payment_db;

DELIMITER $$

CREATE PROCEDURE pkgpymnt_update_pymdtl(
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

    SELECT * FROM pymdtl dtl
    JOIN pymhdr hdr ON hdr.pyhhdrid = dtl.pydhdrid
    WHERE hdr.pyhpymno = p_payment
    FOR UPDATE;

    UPDATE pymhdr hdr
    SET hdr.pyhcallback = 'Y'
    WHERE hdr.pyhpymno = p_payment;

    UPDATE pymdtl dtl
    JOIN pymhdr hdr ON hdr.pyhhdrid = dtl.pydhdrid
    SET dtl.pydstat = 'S'
    WHERE hdr.pyhpymno = p_payment;

    IF ROW_COUNT() > 0 THEN
        SET p_status = 'success';
    END IF;

    COMMIT;

END $$

DELIMITER ;
