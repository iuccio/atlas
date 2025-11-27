-- Shorten only the last version of SubLine Versions in status Revoked
UPDATE traffic_point_element_version
set valid_to = valid_from
where traffic_point_element_version.status = 'REVOKED' and id in (SELECT DISTINCT ON (sloid) id
                                                 FROM traffic_point_element_version
                                                 ORDER BY sloid, valid_from DESC);