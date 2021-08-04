CREATE TABLE timetable_field_number_version
(
    id                              BIGINT NOT NULL PRIMARY KEY,
    fpfnid                          VARCHAR(500),
    name                            VARCHAR(500),
    number                          VARCHAR(50),
    swiss_timetable_field_number    VARCHAR(50),
    creation_date                   TIMESTAMP,
    creator                         VARCHAR(50),
    edition_date                    TIMESTAMP,
    editor                          VARCHAR(50),
    valid_from                      TIMESTAMP,
    valid_to                        TIMESTAMP,
    business_organisation           BIGINT,
    comment                         VARCHAR(250),
    name_compact                    VARCHAR(50)
);

CREATE SEQUENCE timetable_field_number_version_seq START WITH 1000 INCREMENT BY 1;

CREATE TABLE timetable_field_lines_relation
(
    id                              BIGINT NOT NULL PRIMARY KEY,
    slnid                           VARCHAR(500),
    CONSTRAINT fk_timetable_field_number_version
        FOREIGN KEY (id)
            REFERENCES timetable_field_number_version(id)
);

CREATE SEQUENCE timetable_field_lines_relation_seq START WITH 1000 INCREMENT BY 1;