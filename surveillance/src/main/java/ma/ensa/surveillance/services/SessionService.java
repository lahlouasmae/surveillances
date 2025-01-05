package ma.ensa.surveillance.services;

import lombok.RequiredArgsConstructor;
import ma.ensa.surveillance.dto.SessionRequest;
import ma.ensa.surveillance.dto.TimeSlotRequest;
import ma.ensa.surveillance.entities.Session;
import ma.ensa.surveillance.entities.TimeSlot;
import ma.ensa.surveillance.repositories.SessionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SessionService {
    private final SessionRepository sessionRepository;

    @Transactional
    public Session createSession(SessionRequest request) {
        validateSessionDates(request.getDateDebut(), request.getDateFin());

        Session session = new Session();
        session.setType(request.getType());
        session.setDateDebut(request.getDateDebut());
        session.setDateFin(request.getDateFin());

        if (request.getTimeSlots() != null) {
            for (TimeSlotRequest timeSlotRequest : request.getTimeSlots()) {
                TimeSlot timeSlot = new TimeSlot();
                timeSlot.setPeriod(timeSlotRequest.getPeriod());
                timeSlot.setStartTime(LocalTime.parse(timeSlotRequest.getStartTime()));
                timeSlot.setEndTime(LocalTime.parse(timeSlotRequest.getEndTime()));
                session.addTimeSlot(timeSlot);
            }
        }

        return sessionRepository.save(session);
    }
    public Session getCurrentSession(Long sessionId) {
        if (sessionId != null) {
            return sessionRepository.findById(sessionId)
                    .orElseThrow(() -> new RuntimeException("Session not found with ID: " + sessionId));
        }
        // Default to the latest session
        return sessionRepository.findFirstByOrderByDateDebutDesc()
                .orElseThrow(() -> new RuntimeException("No active session found"));
    }

    public List<Session> getAllSessions() {
        return sessionRepository.findAll();
    }

    public Session getSessionById(Long id) {
        return sessionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Session not found with id: " + id));
    }

    public List<Session> getSessionsByType(Session.SessionType type) {
        return sessionRepository.findByType(type);
    }

    @Transactional
    public Session updateSession(Long id, SessionRequest request) {
        Session session = sessionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        session.setType(request.getType());
        session.setDateDebut(request.getDateDebut());
        session.setDateFin(request.getDateFin());

        List<TimeSlot> existingTimeSlots = session.getTimeSlots();
        List<TimeSlotRequest> newTimeSlots = request.getTimeSlots();

        for (int i = 0; i < newTimeSlots.size(); i++) {
            TimeSlotRequest timeSlotRequest = newTimeSlots.get(i);

            if (i < existingTimeSlots.size()) {
                // Update existing time slot
                TimeSlot existingSlot = existingTimeSlots.get(i);
                existingSlot.setPeriod(timeSlotRequest.getPeriod());
                existingSlot.setStartTime(LocalTime.parse(timeSlotRequest.getStartTime()));
                existingSlot.setEndTime(LocalTime.parse(timeSlotRequest.getEndTime()));
            } else {
                // Add new time slot if there are more in the request than existing
                TimeSlot newTimeSlot = new TimeSlot();
                newTimeSlot.setPeriod(timeSlotRequest.getPeriod());
                newTimeSlot.setStartTime(LocalTime.parse(timeSlotRequest.getStartTime()));
                newTimeSlot.setEndTime(LocalTime.parse(timeSlotRequest.getEndTime()));
                newTimeSlot.setSession(session);
                existingTimeSlots.add(newTimeSlot);
            }
        }

        // Remove extra time slots if the new list is shorter
        if (existingTimeSlots.size() > newTimeSlots.size()) {
            existingTimeSlots.subList(newTimeSlots.size(), existingTimeSlots.size()).clear();
        }

        return sessionRepository.save(session);
    }
    @Transactional
    public void deleteSession(Long id) {
        if (!sessionRepository.existsById(id)) {
            throw new RuntimeException("Session not found with id: " + id);
        }
        sessionRepository.deleteById(id);
    }

    private void validateSessionDates(LocalDateTime dateDebut, LocalDateTime dateFin) {
        if (dateDebut == null || dateFin == null) {
            throw new IllegalArgumentException("Start and end dates cannot be null");
        }
        if (dateDebut.isAfter(dateFin)) {
            throw new IllegalArgumentException("Start date must be before end date");
        }
    }
}