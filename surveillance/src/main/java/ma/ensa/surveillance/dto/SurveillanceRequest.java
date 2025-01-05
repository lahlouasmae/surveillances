package ma.ensa.surveillance.dto;

import lombok.Data;
import ma.ensa.surveillance.entities.Surveillance;

@Data
public class SurveillanceRequest {
    private Long departmentId;
    private Long teacherId;
    private Long examId;
    private Surveillance.SurveillanceType type;
}