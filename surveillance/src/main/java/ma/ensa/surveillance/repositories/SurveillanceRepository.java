package ma.ensa.surveillance.repositories;

import ma.ensa.surveillance.entities.Exam;
import ma.ensa.surveillance.entities.Surveillance;
import ma.ensa.surveillance.entities.Teacher;
import ma.ensa.surveillance.entities.TimeSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface SurveillanceRepository extends JpaRepository<Surveillance, Long> {
    @Query("SELECT COUNT(s) FROM Surveillance s WHERE s.teacher = :teacher AND s.exam.dateExam = :examDate AND s.exam.timeSlot = :timeSlot")
    long countByTeacherAndExamDateAndTimeSlot(@Param("teacher") Teacher teacher,
                                              @Param("examDate") LocalDateTime examDate,
                                              @Param("timeSlot") TimeSlot timeSlot);

    long countByTeacherAndType(Teacher teacher, Surveillance.SurveillanceType type);

    int countByTeacher(Teacher teacher);

    List<Surveillance> findByExam_Id(Long examId);

    List<Surveillance> findByTeacher_Id(Long teacherId);
    List<Surveillance> findByExamIn(List<Exam> exams);

    @Query("SELECT s FROM Surveillance s " +
            "JOIN s.exam e " +
            "JOIN e.department d " +
            "WHERE d.id = :departmentId " +
            "AND DATE(e.dateExam) BETWEEN :startDate AND :endDate")
    List<Surveillance> findByDepartmentAndDateRange(
            @Param("departmentId") Long departmentId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );
    Optional<Surveillance> findByTeacherAndExam(Teacher teacher, Exam exam);

}