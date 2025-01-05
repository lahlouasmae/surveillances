package ma.ensa.surveillance.repositories;

import ma.ensa.surveillance.entities.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface ExamRepository extends JpaRepository<Exam, Long> {
    List<Exam> findBySession(Session session);
    boolean existsByLocalAndDateExamAndTimeSlot(Local local, LocalDateTime dateExam, TimeSlot timeSlot);
    boolean existsByTeacherAndDateExamAndTimeSlot(Teacher teacher, LocalDateTime dateExam, TimeSlot timeSlot);
    List<Exam> findByDateExamBetweenAndTimeSlot_Id(LocalDateTime start, LocalDateTime end, Long timeSlotId);
    @Query("SELECT e FROM Exam e WHERE e.department = :department " +
            "AND e.dateExam BETWEEN :startDate AND :endDate")
    List<Exam> findByDepartmentAndDateRange(
            @Param("department") Department department,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );
    @Query("SELECT e FROM Exam e " +
            "WHERE e.department.id = :departmentId " +
            "AND e.dateExam = :date " +
            "AND e.timeSlot.id = :timeSlotId")
    List<Exam> findByDepartmentAndDateAndTimeSlot(
            @Param("departmentId") Long departmentId,
            @Param("date") LocalDate date,
            @Param("timeSlotId") Long timeSlotId
    );
    List<Exam> findDistinctByDateExamBetweenAndTimeSlot_Id(
            LocalDateTime startDateTime,
            LocalDateTime endDateTime,
            Long timeSlotId
    );
}