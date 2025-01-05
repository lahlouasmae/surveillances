package ma.ensa.surveillance.services;

import com.opencsv.CSVReader;
import lombok.RequiredArgsConstructor;
import ma.ensa.surveillance.entities.Local;
import ma.ensa.surveillance.repositories.LocalRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LocalService {
    private final LocalRepository localRepository;

    @Transactional
    public Local createLocal(String nom, int taille, String type) {
        validateLocalData(nom, taille, type);

        if (localRepository.existsByNom(nom)) {
            throw new RuntimeException("A local with this name already exists");
        }

        Local local = new Local();
        local.setNom(nom);
        local.setTaille(taille);
        local.setType(Local.LocalType.valueOf(type.toUpperCase()));

        return localRepository.save(local);
    }

    public List<Local> importLocalsFromCsv(MultipartFile file) {
        List<Local> locals = new ArrayList<>();
        try (CSVReader reader = new CSVReader(new InputStreamReader(file.getInputStream()))) {
            String[] nextLine;
            reader.readNext(); // Skip header line
            while ((nextLine = reader.readNext()) != null) {
                Local local = new Local();

                // Validate and set the name (nom)
                if (localRepository.existsByNom(nextLine[0])) {
                    throw new RuntimeException("Local with name '" + nextLine[0] + "' already exists");
                }
                local.setNom(nextLine[0]);

                // Validate and set the size (taille)
                try {
                    int taille = Integer.parseInt(nextLine[1]);
                    if (taille <= 0) {
                        throw new RuntimeException("Local size must be positive for: " + nextLine[0]);
                    }
                    local.setTaille(taille);
                } catch (NumberFormatException e) {
                    throw new RuntimeException("Invalid size format for local: " + nextLine[0]);
                }

                // Validate and set the type
                try {
                    Local.LocalType type = Local.LocalType.valueOf(nextLine[2].toUpperCase());
                    local.setType(type);
                } catch (IllegalArgumentException e) {
                    throw new RuntimeException("Invalid local type for " + nextLine[0] + ". Must be either SALLE or AMPHI");
                }

                locals.add(local);
            }
            localRepository.saveAll(locals);
        } catch (Exception e) {
            throw new RuntimeException("Error importing locals from CSV: " + e.getMessage());
        }
        return locals;
    }

    public List<Local> getAllLocals() {
        return localRepository.findAll();
    }

    public Local getLocalById(Long id) {
        return localRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Local not found with id: " + id));
    }

    public List<Local> getLocalsByType(String type) {
        Local.LocalType localType = Local.LocalType.valueOf(type.toUpperCase());
        return localRepository.findByType(localType);
    }

    @Transactional
    public Local updateLocal(Long id, String nom, int taille, String type) {
        validateLocalData(nom, taille, type);

        Local local = getLocalById(id);

        if (!local.getNom().equals(nom) && localRepository.existsByNom(nom)) {
            throw new RuntimeException("A local with this name already exists");
        }

        local.setNom(nom);
        local.setTaille(taille);
        local.setType(Local.LocalType.valueOf(type.toUpperCase()));

        return localRepository.save(local);
    }

    @Transactional
    public void deleteLocal(Long id) {
        if (!localRepository.existsById(id)) {
            throw new RuntimeException("Local not found with id: " + id);
        }
        localRepository.deleteById(id);
    }

    private void validateLocalData(String nom, int taille, String type) {
        if (nom == null || nom.trim().isEmpty()) {
            throw new IllegalArgumentException("Local name cannot be empty");
        }
        if (taille <= 0) {
            throw new IllegalArgumentException("Size must be greater than 0");
        }
        try {
            Local.LocalType.valueOf(type.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid local type. Must be either SALLE or AMPHI");
        }
    }
}