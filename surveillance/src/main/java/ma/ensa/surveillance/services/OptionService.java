package ma.ensa.surveillance.services;

import com.opencsv.CSVReader;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import ma.ensa.surveillance.entities.Department;
import ma.ensa.surveillance.entities.Option;
import ma.ensa.surveillance.repositories.DepartmentRepository;
import ma.ensa.surveillance.repositories.OptionRepository;
import org.hibernate.Hibernate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OptionService {
    private final OptionRepository optionRepository;
    private final DepartmentService departmentService;
    private final DepartmentRepository departmentRepository;
    private final EntityManager entityManager;


    public List<Option> getAllOptions() {
        entityManager.clear();
        List<Option> options = optionRepository.findAll();

        for (Option option : options) {
            // Initialize the necessary associations while in the transactional context
            if (option.getDepartment() != null) {
                Hibernate.initialize(option.getDepartment());
            }
            if (option.getModules() != null) {
                Hibernate.initialize(option.getModules());
            }
        }

        return options;
    }
    @Transactional
    public Option createOption(String name, Long departmentId) {
        Department department = departmentService.getDepartmentById(departmentId);

        if (optionRepository.existsByNameAndDepartment(name, department)) {
            throw new RuntimeException("Option with this name already exists in the department");
        }

        Option option = new Option();
        option.setName(name);
        option.setDepartment(department);
        return optionRepository.save(option);
    }

    public List<Option> importOptionsFromCsv(MultipartFile file) {
        List<Option> options = new ArrayList<>();
        try (CSVReader reader = new CSVReader(new InputStreamReader(file.getInputStream()))) {
            String[] nextLine;
            reader.readNext(); // Skip header line
            while ((nextLine = reader.readNext()) != null) {
                Option option = new Option();
                option.setName(nextLine[0]);

                // Retrieve and set the department relationship
                String[] finalNextLine = nextLine;
                Department department = departmentRepository.findById(Long.parseLong(nextLine[1]))
                        .orElseThrow(() -> new RuntimeException("Department not found with id: " + finalNextLine[1]));
                option.setDepartment(department);

                // Initialize empty modules list
                option.setModules(new ArrayList<>());

                options.add(option);
            }
            optionRepository.saveAll(options);
        } catch (Exception e) {
            throw new RuntimeException("Error importing options from CSV: " + e.getMessage());
        }
        return options;
    }

    public Option getOptionById(Long id) {
        return optionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Option not found with id: " + id));
    }

    @Transactional
    public Option updateOption(Long id, String name, Long departmentId) {
        Option option = getOptionById(id);
        Department department = departmentService.getDepartmentById(departmentId);

        if (!option.getName().equals(name) &&
                optionRepository.existsByNameAndDepartment(name, department)) {
            throw new RuntimeException("Option name already exists in this department");
        }

        option.setName(name);
        option.setDepartment(department);
        return optionRepository.save(option);
    }

    @Transactional
    public void deleteOption(Long id) {
        if (!optionRepository.existsById(id)) {
            throw new RuntimeException("Option not found with id: " + id);
        }
        optionRepository.deleteById(id);
    }

    public List<Option> getOptionsByDepartment(Long departmentId) {
        Department department = departmentService.getDepartmentById(departmentId);
        return optionRepository.findByDepartment(department);
    }
}