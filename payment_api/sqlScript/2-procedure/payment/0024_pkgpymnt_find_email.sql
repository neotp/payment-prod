DELIMITER $$

CREATE PROCEDURE pkgpymnt_find_email(
    IN p_payment            VARCHAR(45),
    OUT p_email             VARCHAR(45),
    OUT p_cuscode           VARCHAR(45),
    OUT p_sumamt            VARCHAR(45),
    OUT p_feeamt            VARCHAR(45),
    OUT p_ttamt            VARCHAR(45)
)
BEGIN
    
    SELECT 
      ush.ushemail 
      , pyh.pyhcuscode 
      , pyhsumamt
      , pyhfeeamt
      , pyhtotalamt
    INTO 
        p_email
        , p_cuscode
        , p_sumamt
        , p_feeamt
        , p_ttamt
    FROM pymhdr pyh
    JOIN usrhis ush ON pyh.pyhcreusr = ush.ushusrname
    WHERE pyh.pyhpymno = p_payment;

END $$

DELIMITER ;

