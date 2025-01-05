package ma.ensa.surveillance.repositories;

import ma.ensa.surveillance.entities.Local;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface LocalRepository extends JpaRepository<Local, Long> {
    boolean existsByNom(String nom);
    List<Local> findByType(Local.LocalType type);
    @Query("SELECT l.id AS id, l.nom AS name FROM Local l")
    List<BasicDataProjection> findAllBasic();
}