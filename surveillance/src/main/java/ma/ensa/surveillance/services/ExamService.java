package ma.ensa.surveillance.services;

import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import ma.ensa.surveillance.entities.*;
import ma.ensa.surveillance.entities.Module;
import ma.ensa.surveillance.repositories.DepartmentRepository;
import ma.ensa.surveillance.repositories.ExamRepository;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExamService {
    @Autowired
    private EntityManager entityManager;
    private final ExamRepository examRepository;
    private final TeacherService teacherService;
    private final OptionService optionService;
    private final ModuleService moduleService;
    private final LocalService localService;
    private final TimeSlotService timeSlotService;
    private final SessionService sessionService;
    private final DepartmentRepository departmentRepository;
    private final DepartmentService departmentService;

    @Transactional
    public Exam createExam(Long departmentId, Long teacherId, Long optionId, Long moduleId, Integer studentCount,
                           Long localId, LocalDateTime dateExam, Long timeSlotId, Long sessionId) {


        // Validate all relationships
        Teacher teacher = teacherService.getTeacherById(teacherId);
        Department department = departmentService.getDepartmentById(departmentId);
        Option option = optionService.getOptionById(optionId);
        Module module = moduleService.getModuleById(moduleId);
        Local local = localService.getLocalById(localId);
        TimeSlot timeSlot = timeSlotService.getTimeSlotById(timeSlotId);
        Session session = sessionService.getSessionById(sessionId);

        // Validate student count against local capacity
        if (studentCount > local.getTaille()) {
            throw new RuntimeException("Student count exceeds local capacity");
        }

        // Check if the local is already booked for this time
        if (isLocalBooked(local, dateExam, timeSlot)) {
            throw new RuntimeException("Local is already booked for this time");
        }

        // Check if teacher is available
        if (isTeacherBooked(teacher, dateExam, timeSlot)) {
            throw new RuntimeException("Teacher is already assigned to another exam at this time");
        }

        Exam exam = new Exam();
        exam.setDepartment(department);
        exam.setTeacher(teacher);
        exam.setOption(option);
        exam.setModule(module);
        exam.setStudentCount(studentCount);
        exam.setLocal(local);
        exam.setDateExam(dateExam);
        exam.setTimeSlot(timeSlot);
        exam.setSession(session);

        return examRepository.save(exam);
    }

    @Transactional(readOnly = true)
    public List<Exam> getExamsByDateAndTimeSlot(LocalDate date, Long timeSlotId) {
        System.out.println("Fetching exams for date: " + date + " and timeSlot: " + timeSlotId);

        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(23, 59, 59);

        try {
            List<Exam> exams = examRepository.findDistinctByDateExamBetweenAndTimeSlot_Id(startOfDay, endOfDay, timeSlotId);

            // Use a custom DTO projection to avoid circular references
            return exams.stream()
                    .map(exam -> {
                        Exam safeExam = new Exam();
                        safeExam.setId(exam.getId());
                        safeExam.setStudentCount(exam.getStudentCount());
                        safeExam.setDateExam(exam.getDateExam());

                        // Safely initialize basic properties of related entities
                        if (exam.getTeacher() != null) {
                            Teacher teacher = new Teacher();
                            teacher.setId(exam.getTeacher().getId());
                            teacher.setNom(exam.getTeacher().getNom());
                            safeExam.setTeacher(teacher);
                        }

                        if (exam.getDepartment() != null) {
                            Department dept = new Department();
                            dept.setId(exam.getDepartment().getId());
                            dept.setName(exam.getDepartment().getName());
                            safeExam.setDepartment(dept);
                        }

                        if (exam.getModule() != null) {
                            Module module = new Module();
                            module.setId(exam.getModule().getId());
                            module.setName(exam.getModule().getName());
                            safeExam.setModule(module);
                        }

                        if (exam.getLocal() != null) {
                            Local local = new Local();
                            local.setId(exam.getLocal().getId());
                            local.setNom(exam.getLocal().getNom());
                            safeExam.setLocal(local);
                        }

                        if (exam.getTimeSlot() != null) {
                            TimeSlot timeSlot = new TimeSlot();
                            timeSlot.setId(exam.getTimeSlot().getId());
                            timeSlot.setStartTime(exam.getTimeSlot().getStartTime());
                            timeSlot.setEndTime(exam.getTimeSlot().getEndTime());
                            timeSlot.setPeriod(exam.getTimeSlot().getPeriod());
                            safeExam.setTimeSlot(timeSlot);
                        }

                        return safeExam;
                    })
                    .collect(Collectors.toList());
        } catch (Exception e) {
            System.err.println("Error in getExamsByDateAndTimeSlot: " + e.getMessage());
            e.printStackTrace();
            return new ArrayList<>();
        }
    }
    public List<Exam> findExamsByDateAndTimeSlot(Long departmentId, String date, Long timeSlotId) {
        LocalDate examDate = LocalDate.parse(date);
        return examRepository.findByDepartmentAndDateAndTimeSlot(departmentId, examDate, timeSlotId);
    }

    public List<Exam> getAllExams() {
        return examRepository.findAll();
    }

    public Exam getExamById(Long id) {
        return examRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Exam not found with id: " + id));
    }

    public List<Exam> getExamsBySession(Session session) {
        return examRepository.findBySession(session);
    }

    private boolean isLocalBooked(Local local, LocalDateTime date, TimeSlot timeSlot) {
        return examRepository.existsByLocalAndDateExamAndTimeSlot(local, date, timeSlot);
    }

    private boolean isTeacherBooked(Teacher teacher, LocalDateTime date, TimeSlot timeSlot) {
        return examRepository.existsByTeacherAndDateExamAndTimeSlot(teacher, date, timeSlot);
    }

    @Transactional
    public Exam updateExam(Long id, Long departmentId, Long teacherId, Long optionId, Long moduleId, Integer studentCount,
                           Long localId, LocalDateTime dateExam, Long timeSlotId, Long sessionId) {
        Exam exam = getExamById(id);

        // Perform the same validations as in create
        Teacher teacher = teacherService.getTeacherById(teacherId);
        Department department = departmentService.getDepartmentById(departmentId);
        Option option = optionService.getOptionById(optionId);
        Module module = moduleService.getModuleById(moduleId);
        Local local = localService.getLocalById(localId);
        TimeSlot timeSlot = timeSlotService.getTimeSlotById(timeSlotId);
        Session session = sessionService.getSessionById(sessionId);

        // Only check for conflicts if the time or local has changed
        if (!exam.getLocal().equals(local) || !exam.getDateExam().equals(dateExam) || !exam.getTimeSlot().equals(timeSlot)) {
            if (isLocalBooked(local, dateExam, timeSlot)) {
                throw new RuntimeException("Local is already booked for this time");
            }
        }

        if (!exam.getTeacher().equals(teacher) || !exam.getDateExam().equals(dateExam) || !exam.getTimeSlot().equals(timeSlot)) {
            if (isTeacherBooked(teacher, dateExam, timeSlot)) {
                throw new RuntimeException("Teacher is already assigned to another exam at this time");
            }
        }
        exam.setDepartment(department);
        exam.setTeacher(teacher);
        exam.setOption(option);
        exam.setModule(module);
        exam.setStudentCount(studentCount);
        exam.setLocal(local);
        exam.setDateExam(dateExam);
        exam.setTimeSlot(timeSlot);
        exam.setSession(session);

        return examRepository.save(exam);
    }

    @Transactional
    public void deleteExam(Long id) {
        if (!examRepository.existsById(id)) {
            throw new RuntimeException("Exam not found with id: " + id);
        }
        examRepository.deleteById(id);
    }
}