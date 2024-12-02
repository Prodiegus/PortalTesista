CREATE TABLE usuario (
    nombre VARCHAR(255),
    apellido VARCHAR(255),
    rut VARCHAR(255),
    escuela VARCHAR(255),
    correo VARCHAR(255),
    password VARCHAR(255),
    tipo VARCHAR(255),
    activo BOOLEAN,
    PRIMARY KEY (rut)
);

CREATE UNIQUE INDEX idx_tipo_usuario ON usuario (tipo);

CREATE TABLE tema (
    id INT AUTO_INCREMENT,
    titulo VARCHAR(255),
    resumen TEXT,
    estado VARCHAR(255),
    id_fase INT,
    nombre_escuela VARCHAR(255),
    rut_guia VARCHAR(255),
    PRIMARY KEY (id)
);

CREATE INDEX idx_tema_id_fase ON tema (id_fase);

CREATE TABLE archivos (
    id INT AUTO_INCREMENT,
    nombre VARCHAR(255),
    file BLOB,
    fecha DATETIME,
    tipo VARCHAR(255),
    PRIMARY KEY (id)
);

CREATE TABLE fase (
    id INT AUTO_INCREMENT,
    nombre VARCHAR(255),
    descripcion TEXT,
    tipo VARCHAR(255),
    fecha_inicio DATETIME,
    fecha_termino DATETIME,
    rut_creador VARCHAR(255),
    id_flujo INT,
    PRIMARY KEY (id)
);

CREATE TABLE flujo(
    id INT AUTO_INCREMENT,
    rut_creador VARCHAR(255),
    id_tema INT,
    tipo VARCHAR(255),
    fecha_inicio DATETIME,
    fecha_termino DATETIME,
    PRIMARY KEY (id)
);

CREATE INDEX idx_flujo_rut_creador ON flujo (rut_creador);

CREATE TABLE reunion (
    id INT AUTO_INCREMENT,
    fecha DATETIME,
    resumen TEXT,
    estado VARCHAR(255),
    rut_coordinador VARCHAR(255),
    id_temas INT,
    PRIMARY KEY (id)
);

CREATE TABLE avance (
    id INT AUTO_INCREMENT,
    id_archivo INT,
    id_tema INT,
    comentarios TEXT,
    nota DECIMAL(5,2),
    aprobado INT,
    fecha DATETIME,
    revision_visible BOOLEAN,
    PRIMARY KEY (id)
);

CREATE INDEX idx_avance_id_archivo ON avance (id_archivo);
CREATE INDEX idx_avance_id_tema ON avance (id_tema);

CREATE TABLE escuela (
    nombre VARCHAR(255),
    id_flujo INT,
    rut_profesor_cargo VARCHAR(255),
    PRIMARY KEY (nombre)
);

CREATE INDEX idx_escuela_id_flujo_general ON escuela (id_flujo);
CREATE INDEX idx_escuela_rut_profesor_cargo ON escuela (rut_profesor_cargo);

CREATE TABLE solicitud_tema (
    rut_alumno VARCHAR(255),
    id_tema INT,
    mensaje TEXT,
    PRIMARY KEY (rut_alumno, id_tema)
);

CREATE TABLE revisor_asignado (
    id_tema INT,
    rut_revisor VARCHAR(255),
    rut_profesor_cargo VARCHAR(255),
    PRIMARY KEY (id_tema, rut_revisor)
);

CREATE TABLE alumno_trabaja (
    rut_alumno VARCHAR(255),
    id_tema INT,
    semestre VARCHAR(255),
    PRIMARY KEY (rut_alumno, id_tema, semestre)
);

CREATE TABLE guia (
    rut_guia VARCHAR(255),
    rut_alumno VARCHAR(255),
    semestre VARCHAR(255),
    PRIMARY KEY (rut_guia, rut_alumno, semestre)
);

CREATE TABLE dueno (
    rut VARCHAR(255),
    id_tema INT,
    PRIMARY KEY (rut, id_tema)
);

ALTER TABLE tema ADD CONSTRAINT FK_tema_id_fase FOREIGN KEY (id_fase) REFERENCES fase(id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE tema ADD CONSTRAINT FK_tema_rut_guia FOREIGN KEY (rut_guia) REFERENCES usuario(rut) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE tema ADD CONSTRAINT FK_tema_nombre_escuela FOREIGN KEY (nombre_escuela) REFERENCES escuela(nombre) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE flujo ADD CONSTRAINT FK_flujo_id_tema FOREIGN KEY (id_tema) REFERENCES tema(id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE flujo ADD CONSTRAINT FK_flujo_rut_creador FOREIGN KEY (rut_creador) REFERENCES usuario(rut) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE avance ADD CONSTRAINT FK_avance_id_archivo FOREIGN KEY (id_archivo) REFERENCES archivos(id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE avance ADD CONSTRAINT FK_avance_id_tema FOREIGN KEY (id_tema) REFERENCES tema(id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE escuela ADD CONSTRAINT FK_escuela_id_flujo FOREIGN KEY (id_flujo) REFERENCES flujo(id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE escuela ADD CONSTRAINT FK_escuela_rut_profesor_cargo FOREIGN KEY (rut_profesor_cargo) REFERENCES usuario(rut) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE fase ADD CONSTRAINT FK_fase_rut_creador FOREIGN KEY (rut_creador) REFERENCES usuario(rut) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE fase ADD CONSTRAINT FK_fase_id_flujo FOREIGN KEY (id_flujo) REFERENCES flujo(id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE guia ADD CONSTRAINT FK_guia_rut_guia FOREIGN KEY (rut_guia) REFERENCES usuario(rut) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE guia ADD CONSTRAINT FK_guia_rut_alumno FOREIGN KEY (rut_alumno) REFERENCES usuario(rut) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE solicitud_tema ADD CONSTRAINT FK_solicitud_tema_rut_alumno FOREIGN KEY (rut_alumno) REFERENCES usuario(rut) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE solicitud_tema ADD CONSTRAINT FK_solicitud_tema_id_tema FOREIGN KEY (id_tema) REFERENCES tema(id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE revisor_asignado ADD CONSTRAINT FK_revisor_asignado_id_tema FOREIGN KEY (id_tema) REFERENCES tema(id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE revisor_asignado ADD CONSTRAINT FK_revisor_asignado_rut_revisor FOREIGN KEY (rut_revisor) REFERENCES usuario(rut) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE revisor_asignado ADD CONSTRAINT FK_revisor_asignado_rut_profesor_cargo FOREIGN KEY (rut_profesor_cargo) REFERENCES usuario(rut) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE alumno_trabaja ADD CONSTRAINT FK_alumno_trabaja_rut_alumno FOREIGN KEY (rut_alumno) REFERENCES usuario(rut) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE alumno_trabaja ADD CONSTRAINT FK_alumno_trabaja_id_tema FOREIGN KEY (id_tema) REFERENCES tema(id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE reunion ADD CONSTRAINT FK_reunion_rut_coordinador FOREIGN KEY (rut_coordinador) REFERENCES usuario(rut) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE reunion ADD CONSTRAINT FK_reunion_id_temas FOREIGN KEY (id_temas) REFERENCES tema(id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE dueno ADD CONSTRAINT FK_dueno_rut FOREIGN KEY (rut) REFERENCES usuario(rut) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE dueno ADD CONSTRAINT FK_dueno_id_tema FOREIGN KEY (id_tema) REFERENCES tema(id) ON DELETE CASCADE ON UPDATE CASCADE;