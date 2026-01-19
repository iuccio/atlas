package ch.sbb.atlas.validation;

import ch.sbb.atlas.api.servicepoint.ServicePointVersionModel;
import ch.sbb.atlas.servicepoint.enumeration.MeanOfTransport;
import ch.sbb.atlas.servicepoint.enumeration.StopPointType;
import jakarta.validation.Constraint;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import jakarta.validation.Payload;
import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Constraint(validatedBy = {ValidOnDemand.Validator.class})
public @interface ValidOnDemand {

  String ATLAS_CONSTRAINT_VALID_ON_DEMAND = "atlas.constraint.onDemand {0} {1}";

  String message() default ATLAS_CONSTRAINT_VALID_ON_DEMAND;

  Class<?>[] groups() default {};

  Class<? extends Payload>[] payload() default {};

  class Validator implements ConstraintValidator<ValidOnDemand, ServicePointVersionModel> {

    @Override
    public boolean isValid(ServicePointVersionModel model, ConstraintValidatorContext context) {
      boolean containsOnDemand =
          model.getMeansOfTransport().stream().allMatch(MeanOfTransport.ON_DEMAND::equals);
      boolean isStopPointTypeOnDemand = model.getStopPointType() == StopPointType.ON_DEMAND;
      if ((model.getMeansOfTransport().isEmpty() && model.getStopPointType() == null)) {
        return true;
      }
      return containsOnDemand == isStopPointTypeOnDemand;
    }
  }
}
