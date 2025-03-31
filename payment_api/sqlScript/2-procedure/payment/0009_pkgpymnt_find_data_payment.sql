USE payment_db;

DELIMITER $$

CREATE PROCEDURE pkgpymnt_find_data_payment(
    IN p_payment        VARCHAR(50),
    IN p_card           VARCHAR(50)
)
BEGIN
    DECLARE v_prmtblmerId           VARCHAR(45) DEFAULT '0002'; --tblno 0002 KTC Merchant Id
    DECLARE v_merId                 VARCHAR(250);
    DECLARE v_secure_hash           VARCHAR(500);
    DECLARE v_secure_hash_512       VARCHAR(500);
    DECLARE v_secure_hash_secret    VARCHAR(500);
    DECLARE v_paymentNo             VARCHAR(45);
    DECLARE v_totalamt              DECIMAL(15,2) DEFAULT 0;
    DECLARE v_pipe                  VARCHAR(1) DEFAULT '|';

    SELECT 
        pyh.pyhpymno
        , pyh.pyhtotalamt
    INTO 
        v_paymentNo
        , v_totalamt
    FROM pymhdr pyh
    WHERE pyh.pyhpymno = p_payment;

    SELECT 
        pmdval1
        , pmdval2
    INTO 
        v_merId
        , v_secure_hash_secret 
    FROM prmtbldtl pmd
    WHERE pmd.pmdtblno = v_prmtblmerId
      AND pmd.pmdtype = p_card;

    SELECT 
        CONCAT(v_merId, v_pipe, v_paymentNo, v_pipe, '764', v_pipe, CAST(v_totalamt AS CHAR), v_pipe, 'N', v_pipe, v_secure_hash_secret ) AS secureHash
        , SHA2(CONCAT(v_merId, v_pipe, v_paymentNo, v_pipe, '764', v_pipe, CAST(v_totalamt AS CHAR), v_pipe, 'N', v_pipe, v_secure_hash_secret), 512) AS secureHash512
    INTO
        v_secure_hash
        , v_secure_hash_512 ;


    SELECT 
        v_paymentNo             AS paymentNo
        , v_totalamt            AS totalamt
        , v_merId               AS merchId
        , v_secure_hash         AS secureHash
        , v_secure_hash_512     AS secureHash512
        ;

END $$

DELIMITER ;