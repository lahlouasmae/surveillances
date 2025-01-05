package ma.ensa.surveillance.services;

import lombok.RequiredArgsConstructor;
import ma.ensa.surveillance.dto.PasswordChangeRequest;
import ma.ensa.surveillance.dto.UserProfileUpdateRequest;
import ma.ensa.surveillance.entities.User;
import ma.ensa.surveillance.exception.UserNotFoundException;
import ma.ensa.surveillance.repositories.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    public User getUserById(int id) {
        logger.info("Fetching user with ID {}", id);
        return userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User with ID " + id + " not found"));
    }

    @Transactional
    public User updateUserById(int id, UserProfileUpdateRequest request) {
        logger.info("Updating user with ID {}", id);

        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User with ID " + id + " not found"));

        // Update email
        if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new RuntimeException("Email already exists");
            }
            user.setEmail(request.getEmail());
        }

        // Update fullname
        if (request.getFullname() != null) {
            user.setFullname(request.getFullname());
        }

        // Update username
        if (request.getUsername() != null && !request.getUsername().equals(user.getUsername())) {
            if (userRepository.existsByUsername(request.getUsername())) {
                throw new RuntimeException("Username already exists");
            }
            user.setUsername(request.getUsername());
        }

        return userRepository.save(user);
    }

    @Transactional
    public void changePassword(PasswordChangeRequest request) {
        User user = getUserFromContext();

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        if (request.getNewPassword() == null || request.getNewPassword().isEmpty()) {
            throw new RuntimeException("New password cannot be empty");
        }

        logger.info("Changing password for user: {}", user.getUsername());
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Transactional
    public void deleteCurrentUser() {
        User user = getUserFromContext();
        logger.info("Deleting user: {}", user.getUsername());
        userRepository.delete(user);
    }

    private User getUserFromContext() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        if (username == null || username.isEmpty()) {
            throw new IllegalStateException("Authentication context is missing or invalid");
        }
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("Authenticated user not found: " + username));
    }
}