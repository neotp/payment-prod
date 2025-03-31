USE payment_db;
DELIMITER $$

CREATE PROCEDURE pkgpymnt_find_missing_cn(
    IN  p_cus_code VARCHAR(45)
)
BEGIN
    SELECT 
        pyw.pywdocno AS cnNo, 
        pyw.pywrefdoc AS refCNNo
    FROM pymdp_work pyw
    WHERE pyw.pywcuscode = p_cus_code
      AND pyw.pywdoctype = 'CN'
      AND pyw.pywflag = '1'
      AND NOT EXISTS (
          SELECT 1 
          FROM pymdp_work ref
          WHERE ref.pywcuscode = p_cus_code
            AND ref.pywdocno = pyw.pywrefdoc
            AND ref.pywflag = '1'
      );
END $$

DELIMITER ;
