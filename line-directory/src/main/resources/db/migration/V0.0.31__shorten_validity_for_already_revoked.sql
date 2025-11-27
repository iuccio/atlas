-- Shorten only the last version of Line Versions in status Revoked
UPDATE line_version
set valid_to = valid_from
where line_version.status = 'REVOKED' and id in (SELECT DISTINCT ON (slnid) id
                                                 FROM line_version
                                                 ORDER BY slnid, valid_from DESC);

-- Shorten only the last version of SubLine Versions in status Revoked
UPDATE subline_version
set valid_to = valid_from
where subline_version.status = 'REVOKED' and id in (SELECT DISTINCT ON (slnid) id
                                                 FROM subline_version
                                                 ORDER BY slnid, valid_from DESC);

-- Shorten only the last version of SubLine Versions in status Revoked
UPDATE timetable_field_number_version
set valid_to = valid_from
where timetable_field_number_version.status = 'REVOKED' and id in (SELECT DISTINCT ON (ttfnid) id
                                                 FROM timetable_field_number_version
                                                 ORDER BY ttfnid, valid_from DESC);