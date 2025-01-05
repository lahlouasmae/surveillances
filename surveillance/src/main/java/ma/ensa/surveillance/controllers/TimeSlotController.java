package ma.ensa.surveillance.controllers;

import lombok.RequiredArgsConstructor;
import ma.ensa.surveillance.entities.TimeSlot;
import ma.ensa.surveillance.services.TimeSlotService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/timeslots")
@RequiredArgsConstructor
public class TimeSlotController {
    private final TimeSlotService timeSlotService;

    @PostMapping
    public ResponseEntity<TimeSlot> createTimeSlot(@RequestBody Map<String, String> request) {
        return ResponseEntity.ok(timeSlotService.createTimeSlot(
                LocalTime.parse(request.get("startTime")),
                LocalTime.parse(request.get("endTime")),
                TimeSlot.Period.valueOf(request.get("period"))
        ));
    }

    @GetMapping("/period/{period}")
    public ResponseEntity<List<TimeSlot>> getTimeSlotsByPeriod(@PathVariable String period) {
        return ResponseEntity.ok(timeSlotService.getTimeSlotsByPeriod(TimeSlot.Period.valueOf(period)));
    }

    @GetMapping("/session/{sessionId}")
    public ResponseEntity<List<TimeSlot>> getTimeSlotsBySession(@PathVariable Long sessionId) {
        return ResponseEntity.ok(timeSlotService.getTimeSlotsBySessionId(sessionId));
    }

    @PostMapping("/initialize")
    public ResponseEntity<Void> initializeDefaultTimeSlots() {
        timeSlotService.initializeDefaultTimeSlots();
        return ResponseEntity.ok().build();
    }
}