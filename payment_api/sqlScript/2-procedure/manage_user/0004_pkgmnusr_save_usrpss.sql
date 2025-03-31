DELIMITER $$

CREATE PROCEDURE pkgmnusr_save_usrpss(
    OUT p_count INT
)
BEGIN

    DECLARE user_exists_usrpss INT DEFAULT 0;
    DECLARE user_exists_usrhis INT DEFAULT 0;
    DECLARE done INT DEFAULT 0;
    DECLARE cur_usrname VARCHAR(255);  
   
    DECLARE cur CURSOR FOR 
        SELECT 
            uswusrname 
        FROM usrpss_work; 
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;
    

    OPEN cur;

    read_loop: LOOP
        FETCH cur INTO cur_usrname; 

        IF done THEN
            LEAVE read_loop;
        END IF;

        SELECT 
            COUNT(*) 
        INTO 
            user_exists_usrpss
        FROM usrpss
        WHERE usrusrname = cur_usrname;


        SELECT 
            COUNT(*) 
        INTO 
            user_exists_usrhis
        FROM usrhis
        WHERE ushusrname = cur_usrname;

        IF user_exists_usrpss > 0 AND user_exists_usrhis > 0 THEN
            UPDATE usrpss usr
            JOIN usrpss_work usw ON usr.usrusrname = usw.uswusrname
            SET 
                usr.usrrole = usw.uswrole,
                usr.usrstat = usw.uswstat
            WHERE 
                usr.usrusrname = usw.uswusrname;

            IF ROW_COUNT() > 0 THEN
                SET p_count = 1;
            ELSE
                SET p_count = 0;
            END IF;

        ELSEIF user_exists_usrpss = 0 AND user_exists_usrhis = 0 THEN
            START TRANSACTION;
            BEGIN
                INSERT INTO usrpss(
                    usrusrname,
                    usrpass,
                    usrrole,
                    usrstat
                )
                SELECT
                    uswusrname,
                    uswpass,
                    uswrole,
                    uswstat
                FROM usrpss_work
                WHERE uswusrname = cur_usrname;

                INSERT INTO usrhis(
                    ushusrname,
                    ushfname,
                    ushlname,
                    ushemail,
                    ushpos
                )
                SELECT
                    uswusrname,
                    uswfname,
                    uswlname,
                    uswemail,
                    uswpos
                FROM usrpss_work
                WHERE uswusrname = cur_usrname;

                COMMIT;

                IF ROW_COUNT() > 0 THEN
                    SET p_count = 1;
                ELSE
                    SET p_count = 0;
                END IF;
            END;
        END IF;
    END LOOP; 
    DELETE FROM usrpss 
    WHERE usrusrname NOT IN (SELECT uswusrname FROM usrpss_work);

    DELETE FROM usrhis
    WHERE ushusrname NOT IN (SELECT uswusrname FROM usrpss_work);


    CLOSE cur;

END $$

DELIMITER ;
