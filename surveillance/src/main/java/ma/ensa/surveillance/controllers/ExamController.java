package ma.ensa.surveillance.controllers;

import lombok.RequiredArgsConstructor;
import ma.ensa.surveillance.entities.Exam;
import ma.ensa.surveillance.entities.Session;
import ma.ensa.surveillance.entities.TimeSlot;
import ma.ensa.surveillance.repositories.*;
import ma.ensa.surveillance.services.ExamService;
import ma.ensa.surveillance.services.SessionService;
import ma.ensa.surveillance.services.TimeSlotService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/exams")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3001", allowedHeaders = "*")
public class ExamController {
    private final ExamService examService;
    private final SessionService sessionService;
    private final TimeSlotService timeSlotService;
    private final DepartmentRepository departmentRepository;
    private final TeacherRepository teacherRepository;
    private final OptionRepository optionRepository;
    private final ModuleRepository moduleRepository;
    private final LocalRepository localRepository;
    // In your backend controller
    @GetMapping("/exam-form-data")
    public ResponseEntity<Map<String, Object>> getExamFormData() {
        Map<String, Object> formData = new HashMap<>();
        formData.put("departments", departmentRepository.findAllBasic());  // Just id and name
        formData.put("teachers", teacherRepository.findAllBasic());        // Just id and name
        formData.put("options", optionRepository.findAllBasic());         // Just id and name
        formData.put("modules", moduleRepository.findAllBasic());         // Just id and name
        formData.put("locals", localRepository.findAllBasic());           // Just id and name
        return ResponseEntity.ok(formData);
    }

    @GetMapping("/session/current")
    public ResponseEntity<Session> getCurrentSession() {
        return ResponseEntity.ok(sessionService.getCurrentSession(null));
    }

    @GetMapping("/date/{date}/timeslot/{timeSlotId}")
    public ResponseEntity<?> getExamsByDateAndTimeSlot(
            @PathVariable String date,
            @PathVariable Long timeSlotId) {
        try {
            LocalDate parsedDate = LocalDate.parse(date);
            List<Exam> exams = examService.getExamsByDateAndTimeSlot(parsedDate, timeSlotId);
            return ResponseEntity.ok(exams);
        } catch (DateTimeParseException e) {
            return ResponseEntity.badRequest()
                    .body("Invalid date format. Please use YYYY-MM-DD format: " + e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while fetching exams: " + e.getMessage());
        }
    }

    @GetMapping("/time-slots")
    public ResponseEntity<List<TimeSlot>> getAllTimeSlots() {
        return ResponseEntity.ok(timeSlotService.getAllTimeSlots());
    }

    @PostMapping
    public ResponseEntity<?> createExam(@RequestBody Map<String, Object> request) {
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;
            LocalDateTime dateExam = LocalDateTime.parse(request.get("date_exam").toString(), formatter);

            return ResponseEntity.ok(examService.createExam(
                    Long.parseLong(request.get("department_id").toString()),
                    Long.parseLong(request.get("teacher_id").toString()),
                    Long.parseLong(request.get("option_id").toString()),
                    Long.parseLong(request.get("module_id").toString()),
                    Integer.parseInt(request.get("student_count").toString()),
                    Long.parseLong(request.get("local_id").toString()),
                    dateExam,
                    Long.parseLong(request.get("time_slot_id").toString()),
                    Long.parseLong(request.get("session_id").toString())
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest()
                    .body("Error creating exam: " + e.getMessage());
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<Exam>> getAllExams() {
        return ResponseEntity.ok(
                examService.getAllExams()
        );
    }

    @GetMapping
    public ResponseEntity<List<Exam>> getExams(
            @RequestParam Long departmentId,
            @RequestParam String date,
            @RequestParam Long timeSlotId) {
        return ResponseEntity.ok(
                examService.findExamsByDateAndTimeSlot(departmentId, date, timeSlotId)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Exam> getExamById(@PathVariable Long id) {
        return ResponseEntity.ok(examService.getExamById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Exam> updateExam(
            @PathVariable Long id,
            @RequestBody Map<String, Object> request) {
        return ResponseEntity.ok(examService.updateExam(
                id,
                Long.parseLong(request.get("teacher_id").toString()),
                Long.parseLong(request.get("option_id").toString()),
                Long.parseLong(request.get("module_id").toString()),
                Long.parseLong(request.get("department_id").toString()),
                Integer.parseInt(request.get("student_count").toString()),
                Long.parseLong(request.get("local_id").toString()),
                LocalDateTime.parse(request.get("date_exam").toString()),
                Long.parseLong(request.get("time_slot_id").toString()),
                Long.parseLong(request.get("session_id").toString())
        ));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExam(@PathVariable Long id) {
        examService.deleteExam(id);
        return ResponseEntity.ok().build();
    }
}