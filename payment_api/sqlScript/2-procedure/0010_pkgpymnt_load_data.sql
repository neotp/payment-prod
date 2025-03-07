USE payment_db;

DELIMITER $$

CREATE PROCEDURE pkgpymnt_load_data(
    IN p_cuscode            VARCHAR(50)
    , IN p_offset             INT
    , IN p_limit              INT
)
BEGIN

    DECLARE total_count INT;
    SELECT COUNT(*) 
    INTO total_count
    FROM pymdp_work pyw
    WHERE pyw.pywcuscode = p_cuscode;

    SELECT total_count AS total_count;

    SELECT 
        pyw.pywid
        , pyw.pywflag
        , pyw.pywcuscode
        , pyw.pywdoctype
        , pyw.pywdocno
        , pyw.pywdocdate
        , pyw.pywduedate
        , pyw.pywdocamt
        , pyw.pywbalamt
        , pyw.pywstat
    FROM pymdp_work pyw
    WHERE pyw.pywcuscode = p_cuscode
    ORDER BY pyw.pywduedate ASC
    LIMIT p_limit OFFSET p_offset;

END $$

DELIMITER ;
