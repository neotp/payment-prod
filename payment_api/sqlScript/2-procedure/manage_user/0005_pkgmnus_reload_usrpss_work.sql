USE payment_db;

DELIMITER $$

CREATE PROCEDURE pkgmnusr_reload_usrpss_work()
BEGIN

    UPDATE usrpss_work usw
    JOIN usrpss usr ON usr.usrusrname = usw.uswusrname
    SET usw.uswrole = usr.usrrole
        , usw.uswstat = usr.usrstat;
END $$

DELIMITER ;
