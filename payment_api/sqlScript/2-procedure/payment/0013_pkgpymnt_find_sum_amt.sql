DELIMITER $$

CREATE PROCEDURE pkgpymnt_find_sum_amt(
    IN  p_cus_code      VARCHAR(45),
    OUT p_sumamt        DECIMAL(15,2),
    OUT p_isselect      VARCHAR(45)
)
BEGIN
 
    DECLARE v_sumamt    DECIMAL(15,2) DEFAULT 0;
    DECLARE v_isselect  INT DEFAULT 0;

    SELECT 
        COUNT(*)
        , COALESCE(SUM(
              CASE 
                  WHEN pyw.pywdoctype IN ('SO', 'IV') THEN pyw.pywpaidamt 
                  WHEN pyw.pywdoctype = 'CN' THEN -pyw.pywpaidamt
                  ELSE 0 
              END
          ), 0)  
    INTO v_isselect, v_sumamt
    FROM pymdp_work pyw
    WHERE pyw.pywcuscode = p_cus_code
      AND pyw.pywflag = '1';

    SET p_sumamt = v_sumamt;
    SET p_isselect = CAST(v_isselect AS CHAR);
END $$

DELIMITER ;
