DELIMITER $$

CREATE PROCEDURE pkgpymnt_find_cus_code(
    IN p_username       VARCHAR(50)
    , OUT o_cusname     VARCHAR(255)
    , OUT o_cuscode     VARCHAR(255)
)
BEGIN

    SELECT 
        usr.usrcuscode
        , usr.usrcusname
    INTO 
        o_cuscode
        , o_cusname
    FROM usrpss usr
    WHERE usr.usrusrname = p_username;

END $$

DELIMITER ;