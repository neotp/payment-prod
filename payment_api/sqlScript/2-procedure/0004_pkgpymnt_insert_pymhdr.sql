USE payment_db;

DELIMITER $$

CREATE PROCEDURE pkgpymnt_insert_pymhdr(
    IN p_username       VARCHAR(255)
    IN p_cus_code       VARCHAR(255)
    IN p_payment_no        VARCHAR(255)
    OUT p_status        VARCHAR(50) 
)
BEGIN
    DECLARE v_sumamt DECIMAL(15,2) DEFAULT 0;
    DECLARE v_hdrid INT DEFAULT 0;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET p_status = 'fail';
    END;


    SELECT 
        SUM(pyw.pywdocamt)
    INTO v_sumamt
    FROM pymdp_work pyw
    WHERE pyw.pywcuscode = p_cus_code
      AND pyw.pywflag = '1';

    START TRANSACTION;

    INSERT INTO pymhdr(
        pyhcuscode
        , pyhpymno
        , pyhsumamt
        , pyhcreusr 
        , pyhcredate
    ) VALUES (
        p_cus_code
        , p_payment_no 
        , v_sumamt
        , p_username
        , NOW()
    );

    SELECT 
        pyh.pyhhdrid
    INTO v_hdrid
    FROM pymhdr pyh
    WHERE pyh.pyhcuscode = p_cus_code
      AND pyh.pyhpymno = p_payment_no  
    LIMIT 1;

    INSERT INTO pymdtl(
        pydhdrid
        , pydcuscode
        , pydinvno
        , pyddocdate
        , pydduedate
        , pyddocamt
        , pydbalamt
        , pydstat
    ) SELECT 
        v_hdrid
        , pyw.pywcuscode
        , pyw.pywdocno
        , pyw.pywdocdate
        , pyw.pywduedate
        , pyw.pywdocamt
        , pyw.pywbalamt
        , 'P'
    FROM pymdp_work pyw
    WHERE pyw.pywcuscode = p_cus_code
    AND pyw.pywflag = '1';

    COMMIT;

    SET p_status = 'success';

END $$

DELIMITER ;
