package ma.ensa.surveillance.dto;

import lombok.Data;

@Data
public class UserProfileUpdateRequest {
    private String fullname;
    private String email;
    private String username;
}