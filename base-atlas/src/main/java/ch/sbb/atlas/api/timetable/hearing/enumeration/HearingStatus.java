package ch.sbb.atlas.api.timetable.hearing.enumeration;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(enumAsRef = true)
public enum HearingStatus {
  PLANNED,
  ACTIVE,
  ARCHIVED
}
