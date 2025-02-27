DELIMITER $$

CREATE PROCEDURE pkgmnusr_save_usrpss(
    OUT p_count INT
)
BEGIN
    -- Perform the update
    UPDATE usrpss usr
    JOIN usrpss_work usw ON usr.usrusrname = usw.uswusrname
    SET 
        usr.usrrole = usw.uswrole,
        usr.usrstat = usw.uswstat
    WHERE 
        usr.usrusrname = usw.uswusrname;

    -- Set p_count based on the number of affected rows
    IF ROW_COUNT() > 0 THEN
        SET p_count = 1;  -- Success: Rows were updated
    ELSE
        SET p_count = 0;  -- Failure: No rows were updated
    END IF;

END $$

DELIMITER ;
