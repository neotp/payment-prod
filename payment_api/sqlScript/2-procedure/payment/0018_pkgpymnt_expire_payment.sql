DELIMITER $$

CREATE PROCEDURE pkgpymnt_expire_payment(
    IN p_payment       VARCHAR(50)
)
BEGIN
    DECLARE v_hdrid INT DEFAULT 0;
    DECLARE v_cus_code VARCHAR(255);  
    DECLARE v_invno VARCHAR(255);     
    DECLARE done INT DEFAULT 0;       
    DECLARE inv_cursor CURSOR FOR     
        SELECT pydinvno, pydcuscode
        FROM pymdtl 
        WHERE pydhdrid = v_hdrid;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

    UPDATE pymhdr 
        SET pyhcallback = 'E'
    WHERE pyhpymno = p_payment 
      AND pyhcallback = 'P';
    --   AND pyhcallback <> 'S'; 

    SELECT 
        pyh.pyhhdrid
    INTO 
        v_hdrid
    FROM pymhdr pyh
    WHERE pyh.pyhpymno = p_payment
    LIMIT 1;

    UPDATE pymdtl 
        SET pydstat = 'E'
    WHERE pydhdrid = v_hdrid
      AND pydstat = 'P'; 

    OPEN inv_cursor;

    read_loop: LOOP
        FETCH inv_cursor INTO v_invno, v_cus_code;
        IF done THEN
            LEAVE read_loop; 
        END IF;

        UPDATE pymdp_work 
            SET pywstat = 'N'
        WHERE pywcuscode = v_cus_code  
          AND pywdocno = v_invno
          AND pywstat <> 'S';        
    END LOOP;

    CLOSE inv_cursor;


END $$

DELIMITER ;
