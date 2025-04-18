DELIMITER $$

CREATE PROCEDURE pkgpymnt_find_fee_rate(
    IN p_bank           VARCHAR(45),
    IN p_card           VARCHAR(45),
    OUT p_fee_rate      VARCHAR(45)
)
BEGIN
    
    SELECT 
        CASE 
            WHEN p_card = 'visa' THEN pmdval1
            WHEN p_card = 'master' THEN pmdval2
            ELSE pmdval3
        END AS 'feeRate'
    INTO 
        p_fee_rate
    FROM prmtbldtl pmd
    WHERE pmd.pmdtblno = '0001'
      AND pmd.pmdtype = p_bank;

END $$

DELIMITER ;

