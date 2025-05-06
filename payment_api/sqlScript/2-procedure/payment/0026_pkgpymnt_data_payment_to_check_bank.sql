DELIMITER $$

CREATE PROCEDURE pkgpymnt_data_payment_to_check_bank(
    IN p_payment            VARCHAR(45)
)
BEGIN
     DECLARE v_prmtblmerId           VARCHAR(45) DEFAULT '0002';

    SELECT 
        pyh.pyhpymno    AS paymentNo
        , pmd.pmdval1   AS merchId
        , pmd.pmdval3   AS loginId
        , pmd.pmdval4   AS password
    FROM pymhdr pyh
    JOIN prmtbldtl pmd 
    ON pmd.pmdtblno = v_prmtblmerId 
    AND pmd.pmdtype = pyh.pyhcard
    WHERE pyh.pyhpymno = p_payment
      AND ( pyh.pyhcallback = 'P' OR pyh.pyhcallback = 'E');
END $$

DELIMITER ;
