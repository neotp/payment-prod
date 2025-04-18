DELIMITER $$

CREATE PROCEDURE pkgpymnt_prepare_data_send_notes()
BEGIN

    SELECT 
    '1000' AS company_code
    , pyh.pyhcuscode AS customer_code
    , pyd.pyddoctype AS payment_type
    , pyd.pydinvno AS billing_no
    , pyh.pyhpymno AS payment_doc
    , pyd.pydinvno AS assignment
    , pyd.pyddocdate AS billing_date
    , pyd.pydduedate AS billing_due_date
    , pyd.pyddocamt AS amount
    , pyh.pyhsumamt AS amount_total
    , 'successed'AS bank_status
    , 'KTC' AS bank_approve_ref
    , '' AS payment_method
    , pyh.pyhpymno AS payment_no
    , 'KTC' AS source
    , CURRENT_DATE AS approve_date
    , CURRENT_TIME AS approve_time 
    , 'A000'AS reason_code
    FROM pymhdr pyh
    JOIN pymdtl pyd ON pyh.pyhhdrid = pyd.pydhdrid
    WHERE pyh.pyhcallback = 'Y'
      AND pyh.pyhltnotes <> 'Y'
      AND pyd.pydstat = 'S';

END $$

DELIMITER ;
