TYPE=TRIGGERS
triggers='CREATE DEFINER=`root`@`%` TRIGGER alumno_trabaja_before_insert\nBEFORE INSERT ON alumno_trabaja\nFOR EACH ROW\nBEGIN\n    -- Verificar si ya existe un registro con el mismo id_tema y fecha_termino IS NULL\n    IF EXISTS (\n        SELECT 1\n        FROM alumno_trabaja\n        WHERE id_tema = NEW.id_tema\n          AND fecha_termino IS NULL\n    ) THEN\n        SIGNAL SQLSTATE \'45000\'\n        SET MESSAGE_TEXT = \'No se puede insertar un nuevo registro porque ya existe un alumno trabajando en este tema con fecha_termino NULL.\';\n    END IF;\nEND'
sql_modes=1436549160
definers='root@%'
client_cs_names='utf8mb4'
connection_cl_names='utf8mb4_unicode_ci'
db_cl_names='utf8_general_ci'
created=174308728482
