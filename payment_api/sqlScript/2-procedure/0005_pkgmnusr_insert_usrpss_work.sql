USE payment_db;

DELIMITER $$


CREATE PROCEDURE pkgmnusr_insert_usrpss_work()
BEGIN

    INSERT INTO usrpss_work (
        uswusrname
        , uswfname
        , uswlname
        , uswcuscode
        , uswcusname
        , uswemail
        , uswpos
        , uswrole
        , uswstat
        )
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
    WHERE NOT EXISTS (
        SELECT 1 FROM usrpss_work WHERE usrpss_work.uswusrname = usr.usrusrname
    );
END $$

DELIMITER ;
