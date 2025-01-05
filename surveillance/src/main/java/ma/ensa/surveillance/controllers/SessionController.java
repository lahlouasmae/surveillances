package ma.ensa.surveillance.controllers;
import lombok.RequiredArgsConstructor;
import ma.ensa.surveillance.dto.SessionRequest;
import ma.ensa.surveillance.entities.Session;
import ma.ensa.surveillance.services.SessionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sessions")
@RequiredArgsConstructor
public class SessionController {
    private final SessionService sessionService;

    @PostMapping
    public ResponseEntity<Session> createSession(@RequestBody SessionRequest request) {
        Session session = sessionService.createSession(request);
        return ResponseEntity.ok(session);
    }

    @GetMapping
    public ResponseEntity<List<Session>> getAllSessions() {
        return ResponseEntity.ok(sessionService.getAllSessions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Session> getSessionById(@PathVariable Long id) {
        return ResponseEntity.ok(sessionService.getSessionById(id));
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<Session>> getSessionsByType(@PathVariable String type) {
        return ResponseEntity.ok(sessionService.getSessionsByType(Session.SessionType.valueOf(type)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Session> updateSession(
            @PathVariable Long id,
            @RequestBody SessionRequest request) {
        Session updatedSession = sessionService.updateSession(id, request);
        return ResponseEntity.ok(updatedSession);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSession(@PathVariable Long id) {
        sessionService.deleteSession(id);
        return ResponseEntity.ok().build();
    }
}
