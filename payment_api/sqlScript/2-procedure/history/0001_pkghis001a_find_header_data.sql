DELIMITER $$

CREATE PROCEDURE pkghis001a_find_header_data(
    IN p_cus_code        VARCHAR(45)
    , IN p_pay_no        VARCHAR(45)
    , IN p_bank          VARCHAR(45)
    , IN p_card          VARCHAR(45)
    , IN p_creusr        VARCHAR(45)
    , IN p_credateFrom   VARCHAR(45)
    , IN p_credateTo     VARCHAR(45)
    , IN p_stat          VARCHAR(45)
    , IN p_offset         INT
    , IN p_limit          INT
)
BEGIN

    DECLARE total_count INT;

    SELECT 
        COUNT(*) 
    INTO 
        total_count
    FROM pymhdr pyh
    WHERE pyh.pyhcuscode = COALESCE(NULLIF(p_cus_code, ''), pyh.pyhcuscode)
      AND pyh.pyhpymno = COALESCE(NULLIF(p_pay_no, ''), pyh.pyhpymno)
      AND pyh.pyhbank = COALESCE(NULLIF(p_bank, ''), pyh.pyhbank)
      AND pyh.pyhcard = COALESCE(NULLIF(p_card, ''), pyh.pyhcard)
      AND pyh.pyhcreusr = COALESCE(NULLIF(p_creusr, ''), pyh.pyhcreusr)
      AND Date(pyh.pyhcredate) >= COALESCE(NULLIF(p_credateFrom, ''), Date(pyh.pyhcredate))
      AND Date(pyh.pyhcredate) <= COALESCE(NULLIF(p_credateTo, ''), Date(pyh.pyhcredate))
      AND pyh.pyhcallback = COALESCE(NULLIF(p_stat, ''), pyh.pyhcallback);

      
    SELECT total_count AS total_count;
      

    SELECT 
        pyh.pyhhdrid            AS hdrId
        , pyh.pyhcuscode        AS cuscode
        , pyh.pyhpymno          AS payNo
        , pyh.pyhsumamt         AS amt
        , pyh.pyhfeeamt         AS feeAmt
        , pyh.pyhtotalamt       AS totalAmt
        , pyh.pyhbank           AS bank
        , pyh.pyhcard           AS card
        , Date(pyh.pyhcredate)  AS credate
        , pyh.pyhcreusr         AS creusr
        , pyh.pyhlink           AS link
        , pyh.pyhcallback       AS stat
    FROM pymhdr pyh
    WHERE pyh.pyhcuscode = COALESCE(NULLIF(p_cus_code, ''), pyh.pyhcuscode)
      AND pyh.pyhpymno = COALESCE(NULLIF(p_pay_no, ''), pyh.pyhpymno)
      AND pyh.pyhbank = COALESCE(NULLIF(p_bank, ''), pyh.pyhbank)
      AND pyh.pyhcard = COALESCE(NULLIF(p_card, ''), pyh.pyhcard)
      AND pyh.pyhcreusr = COALESCE(NULLIF(p_creusr, ''), pyh.pyhcreusr)
      AND Date(pyh.pyhcredate) >= COALESCE(NULLIF(p_credateFrom, ''), Date(pyh.pyhcredate))
      AND Date(pyh.pyhcredate) <= COALESCE(NULLIF(p_credateTo, ''), Date(pyh.pyhcredate))
      AND pyh.pyhcallback = COALESCE(NULLIF(p_stat, ''), pyh.pyhcallback)
    ORDER BY pyh.pyhhdrid ASC
    LIMIT p_limit OFFSET p_offset;

END $$

DELIMITER ;
