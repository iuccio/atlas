
CREATE TABLE tth_dossier_year
(
    timetable_year               BIGINT      NOT NULL PRIMARY KEY,
    hearing_status               VARCHAR(50) NOT NULL
);

alter table tth_dossier
    add column timetable_year BIGINT NOT NULL
        constraint fk_timetable_year
            references tth_dossier_year(timetable_year);
