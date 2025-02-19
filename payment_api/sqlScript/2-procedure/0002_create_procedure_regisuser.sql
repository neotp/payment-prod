USE payment_db;

DELIMITER $$

DROP PROCEDURE IF EXISTS regisuser;

CREATE PROCEDURE regisuser(
    IN p_usrname     VARCHAR(255),
    IN p_pass        VARCHAR(255),
    IN p_fname       VARCHAR(255),
    IN p_lname       VARCHAR(255),
    IN p_cuscode     VARCHAR(50),
    IN p_cusname     VARCHAR(255),
    IN p_email       VARCHAR(255),
    IN p_pos         VARCHAR(255),
    OUT p_count      VARCHAR(255)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET p_count = 0;
    END;

    START TRANSACTION;

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
END $$

DELIMITER ;
