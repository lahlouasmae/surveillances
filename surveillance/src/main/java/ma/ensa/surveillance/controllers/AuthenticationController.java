package ma.ensa.surveillance.controllers;

import lombok.RequiredArgsConstructor;
import ma.ensa.surveillance.dto.AuthResponse;
import ma.ensa.surveillance.dto.LoginRequest;
import ma.ensa.surveillance.dto.RegisterRequest;
import ma.ensa.surveillance.services.AuthenticationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {
    private final AuthenticationService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.authenticate(request));
    }
}