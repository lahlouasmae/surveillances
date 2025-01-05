package ma.ensa.surveillance.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "locals")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Local {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nom;

    @Column(nullable = false)
    private int taille;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LocalType type;

    public enum LocalType {
        SALLE,
        AMPHI
    }
}