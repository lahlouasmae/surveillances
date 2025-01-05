package ma.ensa.surveillance.repositories;

import ma.ensa.surveillance.entities.Session;
import ma.ensa.surveillance.entities.TimeSlot;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TimeSlotRepository extends JpaRepository<TimeSlot, Long> {
    List<TimeSlot> findByPeriodOrderByStartTime(TimeSlot.Period period);
    List<TimeSlot> findBySession(Session session);
}