package ma.ensa.surveillance.services;

import lombok.RequiredArgsConstructor;
import ma.ensa.surveillance.entities.Session;
import ma.ensa.surveillance.entities.TimeSlot;
import ma.ensa.surveillance.exception.ResourceNotFoundException;
import ma.ensa.surveillance.repositories.SessionRepository;
import ma.ensa.surveillance.repositories.TimeSlotRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TimeSlotService {
    private final TimeSlotRepository timeSlotRepository;
    private final SessionRepository sessionRepository;

    @Transactional
    public TimeSlot createTimeSlot(LocalTime startTime, LocalTime endTime, TimeSlot.Period period) {
        validateTimeSlot(startTime, endTime, period);

        TimeSlot timeSlot = new TimeSlot();
        timeSlot.setStartTime(startTime);
        timeSlot.setEndTime(endTime);
        timeSlot.setPeriod(period);

        return timeSlotRepository.save(timeSlot);
    }

    public List<TimeSlot> getTimeSlotsByPeriod(TimeSlot.Period period) {
        return timeSlotRepository.findByPeriodOrderByStartTime(period);
    }

    public List<TimeSlot> getAllTimeSlots() {
        return timeSlotRepository.findAll();
    }

    public List<TimeSlot> getTimeSlotsBySessionId(Long sessionId) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Session not found with ID: " + sessionId));
        return timeSlotRepository.findBySession(session);
    }

    public TimeSlot getTimeSlotById(Long id) {
        return timeSlotRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("TimeSlot not found with id: " + id));
    }

    private void validateTimeSlot(LocalTime startTime, LocalTime endTime, TimeSlot.Period period) {
        if (startTime.isAfter(endTime)) {
            throw new IllegalArgumentException("Start time must be before end time");
        }

        // Check for overlapping time slots in the same period
        List<TimeSlot> existingSlots = timeSlotRepository.findByPeriodOrderByStartTime(period);
        for (TimeSlot existing : existingSlots) {
            if (!(endTime.isBefore(existing.getStartTime()) || startTime.isAfter(existing.getEndTime()))) {
                throw new IllegalArgumentException("Time slot overlaps with existing slot");
            }
        }
    }

    // Initialize default time slots
    @Transactional
    public void initializeDefaultTimeSlots() {
        if (timeSlotRepository.count() == 0) {
            // Morning slots
            createTimeSlot(
                    LocalTime.of(8, 0),
                    LocalTime.of(10, 0),
                    TimeSlot.Period.MORNING
            );
            createTimeSlot(
                    LocalTime.of(10, 0),
                    LocalTime.of(12, 0),
                    TimeSlot.Period.MORNING
            );

            // Afternoon slots
            createTimeSlot(
                    LocalTime.of(14, 0),
                    LocalTime.of(16, 0),
                    TimeSlot.Period.AFTERNOON
            );
            createTimeSlot(
                    LocalTime.of(16, 0),
                    LocalTime.of(18, 0),
                    TimeSlot.Period.AFTERNOON
            );
        }
    }
}