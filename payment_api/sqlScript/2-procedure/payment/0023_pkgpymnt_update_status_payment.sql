DELIMITER $$

CREATE PROCEDURE pkgpymnt_update_status_payment(
    IN p_payment       VARCHAR(50),
    IN p_stat           VARCHAR(50),
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

    CREATE TEMPORARY TABLE temp_table AS 
    SELECT  
        pyd.pydinvno AS docno,
        pyd.pydcuscode AS cuscode
    FROM pymdtl pyd
    JOIN pymhdr pyh ON pyh.pyhhdrid = pyd.pydhdrid
    WHERE pyh.pyhpymno = p_payment;

    UPDATE pymhdr hdr
    SET hdr.pyhcallback = p_stat
    WHERE hdr.pyhpymno = p_payment;

    IF p_stat = 'Y' THEN 
        UPDATE pymdtl pyd
        JOIN temp_table tem ON tem.docno = pyd.pydinvno AND tem.cuscode = pyd.pydcuscode
        SET pyd.pydstat = 'S';

        UPDATE pymdp_work pyw
        JOIN temp_table tem ON tem.docno = pyw.pywdocno AND tem.cuscode = pyw.pywcuscode
        SET pyw.pywstat = 'S';
    ELSE 
        UPDATE pymdtl pyd
        JOIN temp_table tem ON tem.docno = pyd.pydinvno AND tem.cuscode = pyd.pydcuscode
        SET pyd.pydstat = 'N';

        UPDATE pymdp_work pyw
        JOIN temp_table tem ON tem.docno = pyw.pywdocno AND tem.cuscode = pyw.pywcuscode
        SET pyw.pywstat = 'N';
    END IF;

    IF ROW_COUNT() > 0 THEN
        SET p_status = 'success';
    END IF;

    COMMIT;

    DROP TEMPORARY TABLE IF EXISTS temp_table;

END $$

DELIMITER ;
