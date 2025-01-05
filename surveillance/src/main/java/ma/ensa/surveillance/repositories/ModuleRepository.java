package ma.ensa.surveillance.repositories;

import ma.ensa.surveillance.entities.Module;
import ma.ensa.surveillance.entities.Option;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ModuleRepository extends JpaRepository<Module, Long> {
    boolean existsByNameAndOption(String name, Option option);
    List<Module> findByOption(Option option);
    @Query("SELECT m.id AS id, m.name AS name FROM Module m")
    List<BasicDataProjection> findAllBasic();
}