USE payment_db;

DELIMITER $$

CREATE PROCEDURE pkgmnusr_delete_user(
    IN p_usrid              INT
    , IN p_user_name        VARCHAR(255)
)
BEGIN
    DELETE FROM usrpss_work WHERE uswid = p_usrid;

END $$


DELIMITER ;
