package ma.ensa.surveillance.controllers;

import lombok.RequiredArgsConstructor;
import ma.ensa.surveillance.dto.SurveillanceRequest;
import ma.ensa.surveillance.entities.Surveillance;
import ma.ensa.surveillance.services.SurveillanceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/surveillances")
@RequiredArgsConstructor
public class SurveillanceController {
    private final SurveillanceService surveillanceService;
    @GetMapping
    public ResponseEntity<?> getSurveillances(
            @RequestParam Long departmentId,
            @RequestParam String startDate,
            @RequestParam String endDate
    ) {
        try {
            LocalDate start = LocalDate.parse(startDate);
            LocalDate end = LocalDate.parse(endDate);

            List<Surveillance> surveillances = surveillanceService.getSurveillancesByDateRangeAndDepartment(
                    departmentId, start, end);

            return ResponseEntity.ok(surveillances);
        } catch (DateTimeParseException e) {
            return ResponseEntity.badRequest()
                    .body("Invalid date format. Please use YYYY-MM-DD format");
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Error processing request: " + e.getMessage());
        }
    }
    @PostMapping
    public ResponseEntity<Surveillance> createSurveillance(@RequestBody SurveillanceRequest request) {
        try {
            Surveillance surveillance = surveillanceService.createSurveillance(
                    request.getDepartmentId(),
                    request.getTeacherId(),
                    request.getExamId(),
                    request.getType()
            );
            return ResponseEntity.ok(surveillance);
        } catch (Exception e) {
            // Log the error
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/exam/{examId}")
    public ResponseEntity<List<Surveillance>> getSurveillancesByExam(@PathVariable Long examId) {
        try {
            return ResponseEntity.ok(surveillanceService.getSurveillancesByExam(examId));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<List<Surveillance>> getSurveillancesByTeacher(@PathVariable Long teacherId) {
        try {
            return ResponseEntity.ok(surveillanceService.getSurveillancesByTeacher(teacherId));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/assign")
    public ResponseEntity<List<Surveillance>> assignSurveillances(@RequestBody Map<String, Object> request) {
        try {
            Long examId = Long.parseLong(request.get("examId").toString());
            return ResponseEntity.ok(surveillanceService.assignSurveillances(examId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSurveillance(@PathVariable Long id) {
        try {
            surveillanceService.deleteSurveillance(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}