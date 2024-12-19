DELIMITER //

CREATE PROCEDURE DropForeignKeyIfExists()
BEGIN
    -- Check if the table 'tema' exists before dropping the foreign key constraint
    IF EXISTS (SELECT * FROM information_schema.TABLES WHERE TABLE_SCHEMA = 'portal_tesista' AND TABLE_NAME = 'tema') THEN
        ALTER TABLE tema DROP FOREIGN KEY FK_tema_id_fase;
        ALTER TABLE tema DROP FOREIGN KEY FK_tema_rut_guia;
        ALTER TABLE tema DROP FOREIGN KEY FK_tema_nombre_escuela;
    END IF;

    -- Check if the table 'flujo' exists before dropping the foreign key constraint
    IF EXISTS (SELECT * FROM information_schema.TABLES WHERE TABLE_SCHEMA = 'portal_tesista' AND TABLE_NAME = 'flujo') THEN
        ALTER TABLE flujo DROP FOREIGN KEY FK_flujo_id_tema;
        ALTER TABLE flujo DROP FOREIGN KEY FK_flujo_rut_creador;
    END IF;

    -- Check if the table 'avance' exists before dropping the foreign key constraint
    IF EXISTS (SELECT * FROM information_schema.TABLES WHERE TABLE_SCHEMA = 'portal_tesista' AND TABLE_NAME = 'avance') THEN
        ALTER TABLE avance DROP FOREIGN KEY FK_avance_id_archivo;
        ALTER TABLE avance DROP FOREIGN KEY FK_avance_id_tema;
    END IF;

    -- Check if the table 'escuela' exists before dropping the foreign key constraint
    IF EXISTS (SELECT * FROM information_schema.TABLES WHERE TABLE_SCHEMA = 'portal_tesista' AND TABLE_NAME = 'escuela') THEN
        ALTER TABLE escuela DROP FOREIGN KEY FK_escuela_id_flujo;
        ALTER TABLE escuela DROP FOREIGN KEY FK_escuela_rut_profesor_cargo;
    END IF;

    -- Check if the table 'fase' exists before dropping the foreign key constraint
    IF EXISTS (SELECT * FROM information_schema.TABLES WHERE TABLE_SCHEMA = 'portal_tesista' AND TABLE_NAME = 'fase') THEN
        ALTER TABLE fase DROP FOREIGN KEY FK_fase_rut_creador;
        ALTER TABLE fase DROP FOREIGN KEY FK_fase_id_flujo;
    END IF;

    -- Check if the table 'guia' exists before dropping the foreign key constraint
    IF EXISTS (SELECT * FROM information_schema.TABLES WHERE TABLE_SCHEMA = 'portal_tesista' AND TABLE_NAME = 'guia') THEN
        ALTER TABLE guia DROP FOREIGN KEY FK_guia_rut_guia;
        ALTER TABLE guia DROP FOREIGN KEY FK_guia_rut_alumno;
    END IF;

    -- Check if the table 'solicitud_tema' exists before dropping the foreign key constraint
    IF EXISTS (SELECT * FROM information_schema.TABLES WHERE TABLE_SCHEMA = 'portal_tesista' AND TABLE_NAME = 'solicitud_tema') THEN
        ALTER TABLE solicitud_tema DROP FOREIGN KEY FK_solicitud_tema_rut_alumno;
        ALTER TABLE solicitud_tema DROP FOREIGN KEY FK_solicitud_tema_id_tema;
    END IF;

    -- Check if the table 'revisor_asignado' exists before dropping the foreign key constraint
    IF EXISTS (SELECT * FROM information_schema.TABLES WHERE TABLE_SCHEMA = 'portal_tesista' AND TABLE_NAME = 'revisor_asignado') THEN
        ALTER TABLE revisor_asignado DROP FOREIGN KEY FK_revisor_asignado_id_tema;
        ALTER TABLE revisor_asignado DROP FOREIGN KEY FK_revisor_asignado_rut_revisor;
        ALTER TABLE revisor_asignado DROP FOREIGN KEY FK_revisor_asignado_rut_profesor_cargo;
    END IF;

    -- Check if the table 'alumno_trabaja' exists before dropping the foreign key constraint
    IF EXISTS (SELECT * FROM information_schema.TABLES WHERE TABLE_SCHEMA = 'portal_tesista' AND TABLE_NAME = 'alumno_trabaja') THEN
        ALTER TABLE alumno_trabaja DROP FOREIGN KEY FK_alumno_trabaja_rut_alumno;
        ALTER TABLE alumno_trabaja DROP FOREIGN KEY FK_alumno_trabaja_id_tema;
    END IF;

    -- Check if the table 'reunion' exists before dropping the foreign key constraint
    IF EXISTS (SELECT * FROM information_schema.TABLES WHERE TABLE_SCHEMA = 'portal_tesista' AND TABLE_NAME = 'reunion') THEN
        ALTER TABLE reunion DROP FOREIGN KEY FK_reunion_rut_coordinador;
        ALTER TABLE reunion DROP FOREIGN KEY FK_reunion_id_temas;
    END IF;

    -- Check if the table 'dueno' exists before dropping the foreign key constraint
    IF EXISTS (SELECT * FROM information_schema.TABLES WHERE TABLE_SCHEMA = 'portal_tesista' AND TABLE_NAME = 'dueno') THEN
        ALTER TABLE dueno DROP FOREIGN KEY FK_dueno_rut;
        ALTER TABLE dueno DROP FOREIGN KEY FK_dueno_id_tema;
    END IF;
END //

CALL DropForeignKeyIfExists();

-- Drop tables if they exist
DROP TABLE IF EXISTS usuario CASCADE;
DROP TABLE IF EXISTS tema CASCADE;
DROP TABLE IF EXISTS archivos CASCADE;
DROP TABLE IF EXISTS fase CASCADE;
DROP TABLE IF EXISTS flujo CASCADE;
DROP TABLE IF EXISTS reunion CASCADE;
DROP TABLE IF EXISTS avance CASCADE;
DROP TABLE IF EXISTS escuela CASCADE;
DROP TABLE IF EXISTS solicitud_tema CASCADE;
DROP TABLE IF EXISTS revisor_asignado CASCADE;
DROP TABLE IF EXISTS alumno_trabaja CASCADE;
DROP TABLE IF EXISTS guia CASCADE;
DROP TABLE IF EXISTS dueno CASCADE;

-- Drop schema
DROP SCHEMA IF EXISTS portal_tesista;

DELIMITER ;