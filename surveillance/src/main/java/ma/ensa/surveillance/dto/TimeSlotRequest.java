package ma.ensa.surveillance.dto;

import lombok.Data;
import ma.ensa.surveillance.entities.TimeSlot;

@Data
public class TimeSlotRequest {
    private String startTime;
    private String endTime;
    private TimeSlot.Period period;
}