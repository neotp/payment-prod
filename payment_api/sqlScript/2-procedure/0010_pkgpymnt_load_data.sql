USE payment_db;

DELIMITER $$

CREATE PROCEDURE pkgpymnt_load_data(
    IN p_cuscode            VARCHAR(50)
)
BEGIN

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
    ORDER BY pyw.pywduedate ASC;

END $$

DELIMITER ;
