package ma.ensa.surveillance.repositories;

import ma.ensa.surveillance.entities.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SessionRepository extends JpaRepository<Session, Long> {
    List<Session> findByType(Session.SessionType type);
    Optional<Session> findFirstByOrderByDateDebutDesc();
}
