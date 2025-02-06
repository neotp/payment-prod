USE payment_db;

DELIMITER $$

DROP PROCEDURE IF EXISTS login;

CREATE PROCEDURE login(
    IN p_usrname VARCHAR(255),
    IN p_pass VARCHAR(255),
    OUT p_usrrole VARCHAR(255)
)
BEGIN
    DECLARE v_countuser INT;

    SELECT COUNT(*)
    INTO v_countuser
    FROM usrpss
    WHERE usrusrname = p_usrname
      AND usrpass = p_pass;

    IF v_countuser = 1 THEN
        SELECT usrrole
        INTO p_usrrole
        FROM usrpss
        WHERE usrusrname = p_usrname
          AND usrpass = p_pass
          AND usrstat <> 'pending';
    ELSE
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'User not found or multiple users detected.';
    END IF;
END $$

DELIMITER ;
