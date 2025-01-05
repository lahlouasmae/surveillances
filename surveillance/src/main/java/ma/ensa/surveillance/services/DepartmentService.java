package ma.ensa.surveillance.services;

import com.opencsv.CSVReader;
import lombok.RequiredArgsConstructor;
import ma.ensa.surveillance.dto.DepartmentDTO;
import ma.ensa.surveillance.entities.Department;
import ma.ensa.surveillance.repositories.DepartmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DepartmentService {
    private final DepartmentRepository departmentRepository;

    public DepartmentService(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    @Transactional
    public Department createDepartment(String name) {
        validateDepartmentName(name);
        Department department = new Department();
        department.setName(name);
        return departmentRepository.save(department);
    }

    public List<Department> importDepartmentsFromCsv(MultipartFile file) {
        List<Department> departments = new ArrayList<>();
        try (CSVReader reader = new CSVReader(new InputStreamReader(file.getInputStream()))) {
            String[] nextLine;
            reader.readNext(); // Skip header line
            while ((nextLine = reader.readNext()) != null) {
                Department department = new Department();
                department.setName(nextLine[0]); // Assuming the CSV only contains the department name
                departments.add(department);
            }
            departmentRepository.saveAll(departments);
        } catch (Exception e) {
            throw new RuntimeException("Error importing departments from CSV: " + e.getMessage());
        }
        return departments;
    }


    public List<DepartmentDTO> getAllDepartments() {
        return departmentRepository.findAll().stream()
                .map(DepartmentDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public Department getDepartmentById(Long id) {
        return departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Department not found with id: " + id));
    }

    @Transactional
    public Department updateDepartment(Long id, String name) {
        validateDepartmentName(name);
        Department existingDepartment = getDepartmentById(id);

        if (!existingDepartment.getName().equals(name) &&
                departmentRepository.existsByNameIgnoreCase(name)) {
            throw new RuntimeException("Department name already exists: " + name);
        }

        existingDepartment.setName(name);
        return departmentRepository.save(existingDepartment);
    }

    @Transactional
    public void deleteDepartment(Long id) {
        if (!departmentRepository.existsById(id)) {
            throw new RuntimeException("Department not found with id: " + id);
        }
        departmentRepository.deleteById(id);
    }

    private void validateDepartmentName(String name) {
        if (!StringUtils.hasText(name)) {
            throw new RuntimeException("Department name cannot be empty");
        }
        if (name.length() > 100) {
            throw new RuntimeException("Department name cannot exceed 100 characters");
        }
    }
}