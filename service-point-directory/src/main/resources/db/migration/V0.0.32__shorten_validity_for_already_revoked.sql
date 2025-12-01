-- Shorten only the last version of SubLine Versions in status Revoked
UPDATE traffic_point_element_version
set valid_to     = valid_from,
    editor       = '7087e562-e073-42b1-b5eb-f6b83700733e',
    edition_date = now()
where traffic_point_element_version.status = 'REVOKED' and id in (SELECT DISTINCT ON (sloid) id
                                                 FROM traffic_point_element_version
                                                 ORDER BY sloid, valid_from DESC);