USE payment_db;

DELIMITER $$

CREATE PROCEDURE pkgmnusr_update_usrpss_work(
    IN p_username       VARCHAR(50)
    , IN p_usrrole      VARCHAR(50)
    , IN p_usrstat      VARCHAR(10)
)
BEGIN

    UPDATE usrpss_work 
    SET uswrole = p_usrrole
        , uswstat = p_usrstat
    WHERE uswusrname = p_username;
END $$

DELIMITER ;
