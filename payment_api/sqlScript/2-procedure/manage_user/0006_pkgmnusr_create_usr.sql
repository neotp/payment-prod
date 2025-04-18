DELIMITER $$

CREATE PROCEDURE pkgmnusr_create_usr(
    IN p_usrname     VARCHAR(255),
    IN p_pass        VARCHAR(255),
    IN p_fname       VARCHAR(255),
    IN p_lname       VARCHAR(255),
    IN p_email       VARCHAR(255),
    IN p_role       VARCHAR(255),
    IN p_pos         VARCHAR(255),
    OUT p_count      INT 
)
BEGIN
    DECLARE user_exists INT DEFAULT 0;

    SELECT 
        COUNT(*) 
    INTO user_exists 
    FROM usrpss 
    WHERE usrusrname = p_usrname;

    IF user_exists > 0 THEN
        SET p_count = 0; 
    ELSE

        START TRANSACTION;
        BEGIN

        INSERT INTO usrpss_work (
            uswusrname
            , uswpass
            , uswfname
            , uswlname
            , uswemail
            , uswpos
            , uswrole
            , uswstat
        ) VALUES (
            p_usrname
            , p_pass
            , p_fname
            , p_lname
            , p_email
            , p_pos
            , p_role
            , 'P'
        );
            COMMIT;
            SET p_count = 1;
        END;
    END IF;
END $$


DELIMITER ;
