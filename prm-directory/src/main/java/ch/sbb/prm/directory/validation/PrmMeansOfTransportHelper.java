package ch.sbb.prm.directory.validation;

import static ch.sbb.atlas.servicepoint.enumeration.MeanOfTransport.BOAT;
import static ch.sbb.atlas.servicepoint.enumeration.MeanOfTransport.BUS;
import static ch.sbb.atlas.servicepoint.enumeration.MeanOfTransport.CABLE_CAR;
import static ch.sbb.atlas.servicepoint.enumeration.MeanOfTransport.CABLE_RAILWAY;
import static ch.sbb.atlas.servicepoint.enumeration.MeanOfTransport.CHAIRLIFT;
import static ch.sbb.atlas.servicepoint.enumeration.MeanOfTransport.ELEVATOR;
import static ch.sbb.atlas.servicepoint.enumeration.MeanOfTransport.METRO;
import static ch.sbb.atlas.servicepoint.enumeration.MeanOfTransport.RACK_RAILWAY;
import static ch.sbb.atlas.servicepoint.enumeration.MeanOfTransport.TRAIN;
import static ch.sbb.atlas.servicepoint.enumeration.MeanOfTransport.TRAM;

import ch.sbb.atlas.servicepoint.enumeration.MeanOfTransport;
import ch.sbb.prm.directory.exception.StopPointMeansOfTransportCombinationNotAllowedException;
import ch.sbb.prm.directory.exception.UnknownMeanOfTransportNotAllowedException;
import java.util.List;
import java.util.Set;
import lombok.experimental.UtilityClass;

@UtilityClass
public class PrmMeansOfTransportHelper {

  public static final List<MeanOfTransport> REDUCED_MEANS_OF_TRANSPORT = List.of(ELEVATOR, BUS, CHAIRLIFT, CABLE_CAR,
      CABLE_RAILWAY, BOAT, TRAM);
  public static final List<MeanOfTransport> COMPLETE_MEANS_OF_TRANSPORT = List.of(METRO, TRAIN, RACK_RAILWAY);

  public boolean isReduced(Set<MeanOfTransport> meanOfTransports){
    validateDoesNotContainsUnknownMeanOfTransport(meanOfTransports);
    boolean containsReduced = REDUCED_MEANS_OF_TRANSPORT.stream().anyMatch(meanOfTransports::contains);
    boolean containsComplete = COMPLETE_MEANS_OF_TRANSPORT.stream().anyMatch(meanOfTransports::contains);
    if(containsReduced && containsComplete){
      throw new StopPointMeansOfTransportCombinationNotAllowedException(meanOfTransports);
    }
    return containsReduced;
  }

  private void validateDoesNotContainsUnknownMeanOfTransport(Set<MeanOfTransport> meanOfTransports){
    if(meanOfTransports.contains(MeanOfTransport.UNKNOWN)){
      throw new UnknownMeanOfTransportNotAllowedException();
    }
  }

  public boolean isAttentionFieldAllowed(Set<MeanOfTransport> meanOfTransports){
    return meanOfTransports.contains(MeanOfTransport.BUS) || meanOfTransports.contains(MeanOfTransport.TRAM);
  }
}
