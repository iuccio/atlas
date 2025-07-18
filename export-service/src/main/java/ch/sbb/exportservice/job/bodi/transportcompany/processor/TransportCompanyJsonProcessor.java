package ch.sbb.exportservice.job.bodi.transportcompany.processor;

import ch.sbb.atlas.api.bodi.TransportCompanyModel;
import ch.sbb.exportservice.job.bodi.transportcompany.entity.TransportCompany;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.item.ItemProcessor;

@Slf4j
public class TransportCompanyJsonProcessor implements ItemProcessor<TransportCompany, TransportCompanyModel> {

  @Override
  public TransportCompanyModel process(TransportCompany transportCompany) {
    return TransportCompanyModel.builder()
        .id(transportCompany.getId())
        .number(transportCompany.getNumber())
        .abbreviation(transportCompany.getAbbreviation())
        .description(transportCompany.getDescription())
        .businessRegisterName(transportCompany.getBusinessRegisterName())
        .transportCompanyStatus(transportCompany.getTransportCompanyStatus())
        .businessRegisterNumber(transportCompany.getBusinessRegisterNumber())
        .enterpriseId(transportCompany.getEnterpriseId())
        .ricsCode(transportCompany.getRicsCode())
        .businessOrganisationNumbers(transportCompany.getBusinessOrganisationNumbers())
        .comment(transportCompany.getComment())
        .build();
  }

}
