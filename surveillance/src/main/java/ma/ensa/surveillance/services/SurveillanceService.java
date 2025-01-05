package ma.ensa.surveillance.services;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import ma.ensa.surveillance.entities.*;
import ma.ensa.surveillance.exception.ResourceNotFoundException;
import ma.ensa.surveillance.repositories.DepartmentRepository;
import ma.ensa.surveillance.repositories.ExamRepository;
import ma.ensa.surveillance.repositories.SurveillanceRepository;
import ma.ensa.surveillance.repositories.TeacherRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class SurveillanceService {
    private final SurveillanceRepository surveillanceRepository;
    private final TeacherService teacherService;
    private final ExamService examService;
    private final ExamRepository examRepository;
    private final DepartmentService departmentService;
    private final DepartmentRepository departmentRepository;
    private final TeacherRepository teacherRepository;




    private static final int AMPHI_LARGE_SUPERVISORS = 4;  // For 80-100 students
    private static final int AMPHI_MEDIUM_SUPERVISORS = 3; // For 65-80 students
    private static final int ROOM_SUPERVISORS = 2;         // For <50 students
    private static final int RESERVISTES_PER_HALF_DAY = 10;
    private static final int MAX_SURVEILLANCES_PER_DAY = 2;

    @Transactional
    public Surveillance createSurveillance(
            Long departmentId,
            Long teacherId,
            Long examId,
            Surveillance.SurveillanceType type) {

        Teacher teacher = teacherRepository.findById(teacherId)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));

        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found"));

        // Check if a surveillance already exists
        Optional<Surveillance> existingSurveillance =
                surveillanceRepository.findByTeacherAndExam(teacher, exam);

        if (existingSurveillance.isPresent()) {
            throw new IllegalStateException("Surveillance already exists");
        }

        // Create new surveillance
        Surveillance surveillance = new Surveillance();
        surveillance.setTeacher(teacher);
        surveillance.setExam(exam);
        surveillance.setType(type);

        return surveillanceRepository.save(surveillance);
    }
    @Transactional
    public List<Surveillance> getSurveillancesByDateRange(Long departmentId, LocalDate startDate, LocalDate endDate) {
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new RuntimeException("Department not found"));

        // First, get all exams in the date range for this department
        List<Exam> examsInRange = examRepository.findByDepartmentAndDateRange(department, startDate, endDate);

        // Then get all surveillances for these exams
        return surveillanceRepository.findByExamIn(examsInRange);
    }

    public List<Surveillance> getSurveillancesByDateRangeAndDepartment(
            Long departmentId, LocalDate startDate, LocalDate endDate) {

        // Verify department exists
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));

        // Get surveillances
        return surveillanceRepository.findByDepartmentAndDateRange(
                departmentId, startDate, endDate);
    }

    @Transactional
    public List<Surveillance> assignSurveillances(Long examId) {
        Exam exam = examService.getExamById(examId);
        List<Surveillance> surveillances = new ArrayList<>();

        int requiredSupervisors = calculateRequiredSupervisors(exam.getLocal(), exam.getStudentCount());
        List<Teacher> availableTeachers = findAvailableTeachers(exam.getDateExam(), exam.getTimeSlot());

        // Assign regular supervisors
        for (int i = 0; i < requiredSupervisors; i++) {
            Teacher teacher = selectTeacherForSurveillance(availableTeachers, exam);
            availableTeachers.remove(teacher);

            Surveillance surveillance = new Surveillance();
            surveillance.setTeacher(teacher);
            surveillance.setExam(exam);
            surveillance.setSession(exam.getSession());
            surveillance.setType(Surveillance.SurveillanceType.TOURNANT);
            surveillances.add(surveillanceRepository.save(surveillance));
        }

        // Assign reservistes
        assignReservistes(exam, availableTeachers);

        return surveillances;
    }

    private void validateSurveillanceAssignment(Teacher teacher, Exam exam) {
        // Check if teacher is the exam owner
        if (teacher.equals(exam.getTeacher())) {
            throw new RuntimeException("Teacher cannot supervise their own exam");
        }

        // Check daily surveillance limit
        long dailySurveillances = surveillanceRepository.countByTeacherAndExamDateAndTimeSlot(
                teacher, exam.getDateExam(), exam.getTimeSlot());

        if (dailySurveillances >= MAX_SURVEILLANCES_PER_DAY) {
            throw new RuntimeException("Teacher has reached maximum surveillances for this time slot");
        }
    }

    private int calculateRequiredSupervisors(Local local, int studentCount) {
        if (local.getType() == Local.LocalType.AMPHI) {
            if (studentCount >= 80) {
                return AMPHI_LARGE_SUPERVISORS;
            } else if (studentCount >= 65) {
                return AMPHI_MEDIUM_SUPERVISORS;
            }
        }
        return ROOM_SUPERVISORS;
    }

    private List<Teacher> findAvailableTeachers(LocalDateTime date, TimeSlot timeSlot) {
        return teacherService.getAllTeachers().stream()
                .filter(teacher -> isTeacherAvailable(teacher, date, timeSlot))
                .collect(Collectors.toList());
    }

    private boolean isTeacherAvailable(Teacher teacher, LocalDateTime date, TimeSlot timeSlot) {
        long dailySurveillances = surveillanceRepository.countByTeacherAndExamDateAndTimeSlot(
                teacher, date, timeSlot);
        return dailySurveillances < MAX_SURVEILLANCES_PER_DAY;
    }

    private Teacher selectTeacherForSurveillance(List<Teacher> availableTeachers, Exam exam) {
        return availableTeachers.stream()
                .filter(teacher -> !teacher.equals(exam.getTeacher()))
                .min(Comparator.comparingInt(teacher ->
                        surveillanceRepository.countByTeacher(teacher)))
                .orElseThrow(() -> new RuntimeException("No available teachers for surveillance"));
    }

    private void assignReservistes(Exam exam, List<Teacher> availableTeachers) {
        List<Teacher> reservisteCandidates = availableTeachers.stream()
                .sorted(Comparator.comparingLong(teacher ->
                        surveillanceRepository.countByTeacherAndType(teacher, Surveillance.SurveillanceType.RESERVISTE)))
                .limit(RESERVISTES_PER_HALF_DAY)
                .collect(Collectors.toList());

        for (Teacher teacher : reservisteCandidates) {
            Surveillance surveillance = new Surveillance();
            surveillance.setTeacher(teacher);
            surveillance.setExam(exam);
            surveillance.setSession(exam.getSession());
            surveillance.setType(Surveillance.SurveillanceType.RESERVISTE);
            surveillanceRepository.save(surveillance);
        }
    }

    public List<Surveillance> getSurveillancesByExam(Long examId) {
        return surveillanceRepository.findByExam_Id(examId);
    }

    public List<Surveillance> getSurveillancesByTeacher(Long teacherId) {
        return surveillanceRepository.findByTeacher_Id(teacherId);
    }

    @Transactional
    public void deleteSurveillance(Long id) {
        if (!surveillanceRepository.existsById(id)) {
            throw new RuntimeException("Surveillance not found");
        }
        surveillanceRepository.deleteById(id);
    }
}