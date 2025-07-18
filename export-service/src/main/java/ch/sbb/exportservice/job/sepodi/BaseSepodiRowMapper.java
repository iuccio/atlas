package ch.sbb.exportservice.job.sepodi;

import ch.sbb.exportservice.util.RowMapperUtil;
import java.sql.ResultSet;
import java.sql.SQLException;

public abstract class BaseSepodiRowMapper {

  protected SharedBusinessOrganisation getBusinessOrganisation(ResultSet rs) throws SQLException {
    return SharedBusinessOrganisation.builder()
        .businessOrganisation(rs.getString("business_organisation"))
        .businessOrganisationNumber(RowMapperUtil.getInteger(rs, "organisation_number"))
        .businessOrganisationAbbreviationDe(rs.getString("abbreviation_de"))
        .businessOrganisationAbbreviationFr(rs.getString("abbreviation_fr"))
        .businessOrganisationAbbreviationEn(rs.getString("abbreviation_en"))
        .businessOrganisationAbbreviationIt(rs.getString("abbreviation_it"))
        .businessOrganisationDescriptionDe(rs.getString("description_de"))
        .businessOrganisationDescriptionFr(rs.getString("description_fr"))
        .businessOrganisationDescriptionEn(rs.getString("description_en"))
        .businessOrganisationDescriptionIt(rs.getString("description_it"))
        .build();
  }

}
