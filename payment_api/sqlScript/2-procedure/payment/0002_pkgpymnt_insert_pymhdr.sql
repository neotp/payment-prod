DELIMITER $$

CREATE PROCEDURE pkgpymnt_insert_pymhdr(
    IN p_username       VARCHAR(255),
    IN p_cus_code       VARCHAR(255),
    IN p_payment_no     VARCHAR(255),
    IN p_sumamt         VARCHAR(255),
    IN p_fee            VARCHAR(255),
    IN p_totalAmt       VARCHAR(255),
    IN p_bank           VARCHAR(255),
    IN p_card           VARCHAR(255),
    OUT p_status        VARCHAR(50) 
)
BEGIN
    DECLARE v_hdrid INT DEFAULT 0;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET p_status = 'fail';
    END;

    START TRANSACTION;

    INSERT INTO pymhdr(
        pyhcuscode
        , pyhpymno
        , pyhsumamt
        , pyhfeeamt
        , pyhtotalamt
        , pyhbank
        , pyhcard
        , pyhcreusr 
        , pyhcredate
        , pyhcallback
        , pyhltnotes
    ) VALUES (
        p_cus_code
        , p_payment_no 
        , p_sumamt 
        , p_fee
        , p_totalAmt
        , p_bank
        , p_card
        , p_username
        , NOW()
        , 'P'
        , 'N'
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
        , pyddoctype
        , pydinvno
        , pyddocdate
        , pydduedate
        , pyddocamt
        , pydbalamt
        , pydpaidamt
        , pydrefdoc
        , pydstat
        , pydnote
    ) SELECT 
        v_hdrid
        , pyw.pywcuscode
        , pyw.pywdoctype
        , pyw.pywdocno
        , pyw.pywdocdate
        , pyw.pywduedate
        , pyw.pywdocamt
        , pyw.pywbalamt
        , pyw.pywpaidamt
        , pyw.pywrefdoc
        , 'P'
        , pyw.pywnote
    FROM pymdp_work pyw
    WHERE pyw.pywcuscode = p_cus_code
    AND pyw.pywflag = '1';

    SET p_status = 'success';
    COMMIT;

END $$

DELIMITER ;
