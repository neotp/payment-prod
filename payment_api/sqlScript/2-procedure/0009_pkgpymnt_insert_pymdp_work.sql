USE payment_db;

DELIMITER $$

CREATE PROCEDURE pkgpymnt_insert_pymdp_work(
    IN p_cuscode            VARCHAR(50)
    , IN p_doc_type         VARCHAR(50)
    , IN p_doc_no           VARCHAR(50)
    , IN p_doc_date         DATE
    , IN p_due_date         DATE
    , IN p_doc_amount       DECIMAL(10,2)
    , IN p_balance_amount   DECIMAL(10,2)
)
BEGIN
    -- Check if the record already exists in the table
    IF NOT EXISTS (
        SELECT 1
        FROM pymdp_work
        WHERE pywcuscode = p_cuscode
        AND pywdocno = p_doc_no
    ) THEN
        -- If it does not exist, insert the new record
        INSERT INTO pymdp_work (
            pywcuscode,
            pywdoctype,
            pywdocno,
            pywdocdate,
            pywduedate,
            pywdocamt,
            pywbalamt,
            pywstat
        ) VALUES (
            p_cuscode,
            p_doc_type,
            p_doc_no,
            p_doc_date,
            p_due_date,
            p_doc_amount,
            p_balance_amount,
            'N'
        );
    END IF;
END $$

DELIMITER ;

