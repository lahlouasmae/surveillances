package ma.ensa.surveillance.controllers;

import lombok.RequiredArgsConstructor;
import ma.ensa.surveillance.dto.UserProfileUpdateRequest;
import ma.ensa.surveillance.dto.PasswordChangeRequest;
import ma.ensa.surveillance.services.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/profile/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getUserById(@PathVariable int id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PutMapping("/profile/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> updateUserById(
            @PathVariable int id,
            @RequestBody UserProfileUpdateRequest request) {
        return ResponseEntity.ok(userService.updateUserById(id, request));
    }

    @PutMapping("/password")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> changePassword(@RequestBody PasswordChangeRequest request) {
        userService.changePassword(request);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/account")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> deleteAccount() {
        userService.deleteCurrentUser();
        return ResponseEntity.ok().build();
    }
}