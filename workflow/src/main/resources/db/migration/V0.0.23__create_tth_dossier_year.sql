CREATE TABLE tth_dossier_year
(
    timetable_year               BIGINT      NOT NULL PRIMARY KEY,
    hearing_status               VARCHAR(50) NOT NULL
);

ALTER TABLE tth_dossier
    ADD COLUMN timetable_year BIGINT
        CONSTRAINT fk_timetable_year
            REFERENCES tth_dossier_year(timetable_year);
