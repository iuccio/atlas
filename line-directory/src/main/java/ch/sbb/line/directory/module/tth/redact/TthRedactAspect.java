package ch.sbb.line.directory.module.tth.redact;

import ch.sbb.atlas.kafka.model.user.admin.ApplicationType;
import ch.sbb.atlas.redact.RedactAspect;
import ch.sbb.atlas.user.administration.security.service.CantonBasedUserAdministrationService;
import lombok.RequiredArgsConstructor;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

@Component
@Aspect
@RequiredArgsConstructor
public class TthRedactAspect {

  private final CantonBasedUserAdministrationService cantonBasedUserAdministrationService;

  @Around("@annotation(ch.sbb.line.directory.module.tth.redact.TthRedacted)")
  public Object redactSensitiveDataForTthReader(ProceedingJoinPoint joinPoint) throws Throwable {
    Object resultObject = joinPoint.proceed();

    boolean mayReadPrivateInfo = cantonBasedUserAdministrationService.isAtLeastExplicitReader(ApplicationType.TIMETABLE_HEARING);
    if (mayReadPrivateInfo) {
      return resultObject;
    }

    return redactObject(resultObject);
  }

  static Object redactObject(Object resultObject) {
    return RedactAspect.redactResult(resultObject);
  }

}
