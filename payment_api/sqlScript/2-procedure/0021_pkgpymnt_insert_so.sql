USE payment_db;

DELIMITER $$

CREATE PROCEDURE pkgpymnt_insert_so(
    IN p_cus_code   VARCHAR(255),
    IN p_doc_type   VARCHAR(255),
    IN p_doc_no     VARCHAR(255),
    IN p_doc_amt    VARCHAR(255),
    IN p_usage      VARCHAR(255),
    IN p_note       VARCHAR(50),
    OUT p_count      INT 
)
BEGIN
    DECLARE invno_exists INT DEFAULT 0;

    SELECT 
        COUNT(*) 
    INTO invno_exists 
    FROM pymdp_work 
    WHERE pywdocno = p_doc_no;

    IF invno_exists > 0 THEN
        SET p_count = 0; 
    ELSE

        START TRANSACTION;
        BEGIN
            INSERT INTO pymdp_work(
                pywcuscode
                , pywdoctype
                , pywdocno
                , pywdocdate
                , pywduedate
                , pywdocamt
                , pywbalamt
                , pywpaidamt
                , pywstat
                , pywnote
            ) VALUES (
                p_cus_code
                , p_doc_type
                , p_doc_no
                , NOW()
                , NOW()
                , 0
                , 0
                , p_doc_amt
                , 'N'
                , p_note
            );
            
            COMMIT;
            SET p_count = 1;
        END;
    END IF;
END $$


DELIMITER ;
