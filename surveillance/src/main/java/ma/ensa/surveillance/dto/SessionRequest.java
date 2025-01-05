package ma.ensa.surveillance.dto;

import lombok.Data;
import ma.ensa.surveillance.entities.Session;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class SessionRequest {
    private Session.SessionType type;
    private LocalDateTime dateDebut;
    private LocalDateTime dateFin;
    private List<TimeSlotRequest> timeSlots;
}
