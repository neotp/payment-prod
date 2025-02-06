USE payment_db;

DELIMITER $$

DROP PROCEDURE IF EXISTS pymdtl;

CREATE PROCEDURE pymdtl(
    IN p_paymentno      VARCHAR(255),
    IN p_invno          VARCHAR(255),
    IN p_docamt         VARCHAR(255),
    IN p_balamt         VARCHAR(255),
    IN p_docdate        VARCHAR(255),
    IN p_duedate        VARCHAR(255),
    OUT p_count         VARCHAR(255)
)
BEGIN

    SELECT pyhhdrid
    INTO v_pyhhdrid
    FROM pymhdr
    WHERE pyhpymno = p_paymentno;

    INSERT INTO pymdtl(
        pydhdrid
        , pydinvno
        , pyddocamt
        , pydbalamt
        , pyddocdate
        , pydduedate
        , pydstat
    ) VALUES (
        v_pyhhdrid
        , p_invno
        , p_docamt
        , p_balamt
        , p_docdate
        , p_duedate
        , 'Process'
    );

END $$

DELIMITER ;
