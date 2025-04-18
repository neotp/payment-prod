DELIMITER $$

CREATE PROCEDURE pkghis001b_find_detail_data(
    IN p_hdrid            INT
    , IN p_offset         INT
    , IN p_limit          INT
)
BEGIN

    DECLARE total_count INT;

    SELECT 
        COUNT(*) 
    INTO 
        total_count
    FROM pymdtl pyd
    WHERE pyd.pydhdrid = COALESCE(NULLIF(p_hdrid, ''), pyd.pydhdrid);

    SELECT total_count AS total_count;
      
    SELECT 
        pyd.pyddoctype              AS docType
        , pyd.pydinvno              AS docNo
        , Date(pyd.pyddocdate)      AS docDate
        , Date(pyd.pydduedate)      AS dueDate
        , pyd.pyddocamt             AS docAmt
        , pyd.pydbalamt             AS balAmt
        , pyd.pydpaidamt            AS paidAmt
        , pyd.pydrefdoc             AS refDoc
        , pyd.pydterm               AS term
        , pyd.pydstat               AS stat
        , pyd.pydnote               AS note
    FROM pymdtl pyd
    WHERE pyd.pydhdrid = COALESCE(NULLIF(p_hdrid, ''), pyd.pydhdrid)
    ORDER BY pyd.pyddtlid ASC
    LIMIT p_limit OFFSET p_offset;

END $$

DELIMITER ;
