package ch.sbb.business.organisation.directory.module.transportcompany.repository;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.tuple;

import ch.sbb.atlas.model.controller.IntegrationTest;
import ch.sbb.business.organisation.directory.module.transportcompany.entity.TransportCompany;
import ch.sbb.business.organisation.directory.module.transportcompany.entity.TransportCompanyRelation;
import java.time.LocalDate;
import java.util.List;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

@IntegrationTest
class TransportCompanyRelationRepositoryTest {

  private final TransportCompanyRelationRepository transportCompanyRelationRepository;
  private final TransportCompanyRepository transportCompanyRepository;

  @Autowired
  public TransportCompanyRelationRepositoryTest(
      TransportCompanyRelationRepository transportCompanyRelationRepository,
      TransportCompanyRepository transportCompanyRepository) {
    this.transportCompanyRelationRepository = transportCompanyRelationRepository;
    this.transportCompanyRepository = transportCompanyRepository;
  }

  @AfterEach
  void tearDown() {
    transportCompanyRelationRepository.deleteAll();
  }

  @Test
  void shouldFindAllBySboidOrderByValidFrom() {
    // given
    transportCompanyRepository.saveAll(
        List.of(
            TransportCompany.builder().id(1L).build(),
            TransportCompany.builder().id(2L).build(),
            TransportCompany.builder().id(3L).build()
        )
    );
    transportCompanyRelationRepository.saveAll(
        List.of(
            TransportCompanyRelation.builder()
                .transportCompany(TransportCompany.builder().id(1L).build())
                .sboid("ch:1:sboid:100")
                .validFrom(LocalDate.of(2020, 1, 1))
                .validTo(LocalDate.of(2021, 1, 1))
                .build(),
            TransportCompanyRelation.builder()
                .transportCompany(TransportCompany.builder().id(2L).build())
                .sboid("ch:1:sboid:100")
                .validFrom(LocalDate.of(2022, 1, 1))
                .validTo(LocalDate.of(2023, 1, 1))
                .build(),
            TransportCompanyRelation.builder()
                .transportCompany(TransportCompany.builder().id(3L).build())
                .sboid("ch:1:sboid:222")
                .validFrom(LocalDate.of(2024, 1, 1))
                .validTo(LocalDate.of(2025, 1, 1))
                .build()
        )
    );
    // when
    List<TransportCompanyRelation> result = transportCompanyRelationRepository.findAllBySboidOrderByValidFrom("ch:1:sboid:100");
    // then
    assertThat(result).hasSize(2)
        .extracting(TransportCompanyRelation::getValidFrom, TransportCompanyRelation::getSboid)
        .containsExactly(
            tuple(LocalDate.of(2020, 1, 1), "ch:1:sboid:100"),
            tuple(LocalDate.of(2022, 1, 1), "ch:1:sboid:100")
        );
  }
}