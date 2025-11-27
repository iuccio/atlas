-- Shorten only the last version of SubLine Versions in status Revoked
UPDATE business_organisation_version
set valid_to = valid_from
where business_organisation_version.status = 'REVOKED' and id in (SELECT DISTINCT ON (sboid) id
                                                 FROM business_organisation_version
                                                 ORDER BY sboid, valid_from DESC);