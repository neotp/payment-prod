DELIMITER $$
CREATE PROCEDURE pkglogin_login(
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
        SET p_usrrole = 'notfound';
    END IF;
END $$

DELIMITER ;
