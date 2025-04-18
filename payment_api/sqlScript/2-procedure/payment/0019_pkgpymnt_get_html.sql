DELIMITER $$

CREATE PROCEDURE pkgpymnt_get_html(
    IN p_payment_no     VARCHAR(100),
    IN p_link           VARCHAR(100),
    OUT p_html          TEXT
)
BEGIN

  SELECT 
    pyh.pyhhtml AS html
  INTO 
    p_html
  FROM pymhdr pyh
  WHERE pyh.pyhpymno = p_payment_no
    AND pyh.pyhlink = p_link
    AND pyh.pyhcallback = 'P'
    AND pyh.pyhcallback <> 'E'
    AND pyh.pyhcallback <> 'Y';

END $$

DELIMITER ;
