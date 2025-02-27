USE payment_db;

DELIMITER $$

CREATE PROCEDURE pkgmnusr_load_data()
BEGIN

    SELECT 
        usw.uswusrname
        , usw.uswfname
        , usw.uswlname
        , usw.uswcuscode
        , usw.uswcusname
        , usw.uswemail
        , usw.uswpos
        , usw.uswrole
        , usw.uswstat
    FROM usrpss_work usw;

END $$

DELIMITER ;