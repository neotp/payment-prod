-- check Event
SET GLOBAL event_scheduler = ON;

SHOW VARIABLES LIKE 'event_scheduler';

SHOW EVENTS;

-- Create Event
CREATE EVENT clear_data_midnight
ON SCHEDULE EVERY 1 DAY
STARTS '2025-03-01 00:00:00'
DO
    DELETE FROM pymdp_work;
