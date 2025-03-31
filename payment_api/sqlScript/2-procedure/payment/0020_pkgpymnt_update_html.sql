USE payment_db;

DELIMITER $$

CREATE PROCEDURE pkgpymnt_update_html(
    IN p_payment        VARCHAR(50),
    IN p_link           VARCHAR(250),
    IN p_html           TEXT
)
BEGIN

    UPDATE pymhdr 
        SET pyhhtml = p_html
          , pyhlink = p_link
    WHERE pyhpymno = p_payment;
    
END $$

DELIMITER ;
