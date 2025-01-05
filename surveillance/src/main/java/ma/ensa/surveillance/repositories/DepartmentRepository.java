package ma.ensa.surveillance.repositories;

import ma.ensa.surveillance.entities.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface DepartmentRepository extends JpaRepository<Department, Long> {
    boolean existsByNameIgnoreCase(String name);
    Optional<Department> findByNameIgnoreCase(String name);
    @Query("SELECT d.id AS id, d.name AS name FROM Department d")
    List<BasicDataProjection> findAllBasic();
}