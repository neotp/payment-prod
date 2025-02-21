USE payment_db;

DELIMITER $$

DROP PROCEDURE IF EXISTS pkgmnusr_find_data_pending;

CREATE PROCEDURE pkgmnusr_find_data_pending()
BEGIN
    SELECT 
        usr.usrusrname
        , ush.ushfname
        , ush.ushlname
        , usr.usrcuscode
        , usr.usrcusname
        , ush.ushemail
        , ush.ushpos
        , usr.usrrole
        , usr.usrstat
    FROM usrhis ush
    JOIN usrpss usr ON ush.ushusrname = usr.usrusrname
    WHERE usr.usrstat = 'P';
END $$

DELIMITER ;
