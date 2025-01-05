package ma.ensa.surveillance.repositories;

import ma.ensa.surveillance.entities.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TeacherRepository extends JpaRepository<Teacher, Long> {
    boolean existsByEmail(String email);
    List<Teacher> findByDepartment_Id(Long departmentId);
    @Query("SELECT t.id AS id, t.nom AS name FROM Teacher t")
    List<BasicDataProjection> findAllBasic();

}