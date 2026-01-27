package ch.sbb.atlas;

import ch.sbb.atlas.business.organisation.repository.BusinessOrganisationVersionSharingDataAccessor;
import ch.sbb.atlas.transport.company.repository.TransportCompanySharingDataAccessor;
import org.mockito.Mockito;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;

@TestConfiguration
public class TestConfig {

  @Bean
  public BusinessOrganisationVersionSharingDataAccessor businessOrganisationVersionSharingDataAccessor() {
    return Mockito.mock(BusinessOrganisationVersionSharingDataAccessor.class);
  }

  @Bean
  public TransportCompanySharingDataAccessor transportCompanySharingDataAccessor() {
    return Mockito.mock(TransportCompanySharingDataAccessor.class);
  }
}
