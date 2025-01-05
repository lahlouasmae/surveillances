package ma.ensa.surveillance.entities;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "sessions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Session {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SessionType type;

    @Column(name = "date_debut", nullable = false)
    private LocalDateTime dateDebut;

    @Column(name = "date_fin", nullable = false)
    private LocalDateTime dateFin;

    @JsonManagedReference
    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL)
    private List<TimeSlot> timeSlots = new ArrayList<>();

    public void addTimeSlot(TimeSlot timeSlot) {
        timeSlots.add(timeSlot);
        timeSlot.setSession(this);
    }

    public enum SessionType {
        NORMALE_HIVER("Normale d'hiver"),
        NORMALE_PRINTEMPS("Normale de printemps"),
        RATTRAPAGE_HIVER("Rattrapage d'hiver"),
        RATTRAPAGE_PRINTEMPS("Rattrapage de printemps");

        private final String libelle;

        SessionType(String libelle) {
            this.libelle = libelle;
        }

        public String getLibelle() {
            return libelle;
        }
    }
}