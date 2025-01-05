package ma.ensa.surveillance.services;

import lombok.RequiredArgsConstructor;
import ma.ensa.surveillance.dto.AuthResponse;
import ma.ensa.surveillance.dto.LoginRequest;
import ma.ensa.surveillance.dto.RegisterRequest;
import ma.ensa.surveillance.entities.User;
import ma.ensa.surveillance.exception.UserAlreadyExistsException;
import ma.ensa.surveillance.exception.UserNotFoundException;
import ma.ensa.surveillance.repositories.UserRepository;
import ma.ensa.surveillance.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Validate request
        validateRegistrationRequest(request);

        // Check if username or email already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new UserAlreadyExistsException("Username already exists: " + request.getUsername());
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException("Email already exists: " + request.getEmail());
        }

        // Create new user
        var user = createUserFromRequest(request);

        // Save user
        try {
            user = userRepository.save(user);
        } catch (Exception e) {
            throw new RuntimeException("Error occurred while saving user", e);
        }

        // Generate token and create response
        var token = jwtService.generateToken(user);
        return new AuthResponse(token, user.getUsername(), user.getRole());
    }

    public AuthResponse authenticate(LoginRequest request) {
        // Validate request
        validateLoginRequest(request);

        try {
            // Authenticate user
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()
                    )
            );
        } catch (BadCredentialsException e) {
            throw new BadCredentialsException("Invalid username or password");
        }

        // Get user and generate token
        var user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new UserNotFoundException("User not found: " + request.getUsername()));

        var token = jwtService.generateToken(user);
        return new AuthResponse(token, user.getUsername(), user.getRole());
    }

    private void validateRegistrationRequest(RegisterRequest request) {
        if (!StringUtils.hasText(request.getUsername())) {
            throw new IllegalArgumentException("Username cannot be empty");
        }
        if (!StringUtils.hasText(request.getPassword())) {
            throw new IllegalArgumentException("Password cannot be empty");
        }
        if (!StringUtils.hasText(request.getEmail())) {
            throw new IllegalArgumentException("Email cannot be empty");
        }
        if (!request.getEmail().matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            throw new IllegalArgumentException("Invalid email format");
        }
        if (request.getRole() == null) {
            throw new IllegalArgumentException("Role cannot be null");
        }
    }

    private void validateLoginRequest(LoginRequest request) {
        if (!StringUtils.hasText(request.getUsername())) {
            throw new IllegalArgumentException("Username cannot be empty");
        }
        if (!StringUtils.hasText(request.getPassword())) {
            throw new IllegalArgumentException("Password cannot be empty");
        }
    }

    private User createUserFromRequest(RegisterRequest request) {
        var user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());
        user.setFullname(request.getFullname());
        user.setRole(request.getRole());
        return user;
    }
}