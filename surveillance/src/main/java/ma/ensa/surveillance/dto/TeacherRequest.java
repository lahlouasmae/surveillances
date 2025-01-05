package ma.ensa.surveillance.dto;

import lombok.Data;

@Data
public class TeacherRequest {
    private String nom;
    private String prenom;
    private String email;
    private boolean dispense;
    private Long departmentId;
}
