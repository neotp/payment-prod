DELIMITER $$

CREATE PROCEDURE pkgpymnt_find_invoice(
    IN p_payment            VARCHAR(45)
)
BEGIN
    
    SELECT 
      pyd.pydinvno AS invno
      , pyd.pyddocamt AS amt
      , pyd.pydpaidamt AS paid
    FROM pymhdr pyh
    JOIN pymdtl pyd ON pyh.pyhhdrid = pyd.pydhdrid
    WHERE pyh.pyhpymno = p_payment;

END $$

DELIMITER ;

