package ma.ensa.surveillance.repositories;

import ma.ensa.surveillance.entities.Department;
import ma.ensa.surveillance.entities.Option;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface OptionRepository extends JpaRepository<Option, Long> {
    boolean existsByNameAndDepartment(String name, Department department);
    List<Option> findByDepartment(Department department);
    @Query("SELECT o.id AS id, o.name AS name FROM Option o")
    List<BasicDataProjection> findAllBasic();
}