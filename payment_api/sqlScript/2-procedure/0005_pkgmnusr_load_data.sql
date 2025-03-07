USE payment_db;

DELIMITER $$

CREATE PROCEDURE pkgmnusr_load_data(
    IN p_offset INT,
    IN p_limit INT
)
BEGIN
    -- Get total count of records
    SELECT COUNT(*) AS total_count FROM usrpss_work;

    SELECT 
        usw.uswusrname,
        usw.uswfname,
        usw.uswlname,
        usw.uswcuscode,
        usw.uswcusname,
        usw.uswemail,
        usw.uswpos,
        usw.uswrole,
        usw.uswstat
    FROM usrpss_work AS usw
    LIMIT p_limit OFFSET p_offset;

END $$

DELIMITER ;