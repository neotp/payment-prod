USE payment_db;

DELIMITER $$

CREATE PROCEDURE pkgregis_regisuser(
    IN p_usrname     VARCHAR(255),
    IN p_pass        VARCHAR(255),
    IN p_fname       VARCHAR(255),
    IN p_lname       VARCHAR(255),
    IN p_cuscode     VARCHAR(50),
    IN p_cusname     VARCHAR(255),
    IN p_email       VARCHAR(255),
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
            INSERT INTO usrpss(
                usrusrname
                , usrpass
                , usrcuscode
                , usrcusname
                , usrrole
                , usrstat
            ) VALUES (
                p_usrname
                , p_pass
                , p_cuscode
                , p_cusname
                , 'user'
                , 'P'
            );

            INSERT INTO usrhis(
                ushusrname
                , ushfname
                , ushlname
                , ushemail
                , ushpos
            ) VALUES (
                p_usrname
                , p_fname
                , p_lname
                , p_email
                , p_pos
            );
            COMMIT;
            SET p_count = 1;
        END;
    END IF;
END $$


DELIMITER ;
