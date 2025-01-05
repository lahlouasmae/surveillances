package ma.ensa.surveillance.services;

import com.opencsv.CSVReader;
import lombok.RequiredArgsConstructor;
import ma.ensa.surveillance.dto.TeacherRequest;
import ma.ensa.surveillance.entities.Department;
import ma.ensa.surveillance.entities.Teacher;
import ma.ensa.surveillance.repositories.DepartmentRepository;
import ma.ensa.surveillance.repositories.TeacherRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TeacherService {
    private final TeacherRepository teacherRepository;
    private final DepartmentRepository departmentRepository;

    public List<Teacher> getAllTeachers() {
        return teacherRepository.findAll();
    }
    public Teacher getTeacherById(Long id) {
        return teacherRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Teacher not found with id: " + id));
    }

    public List<Teacher> importTeachersFromCsv(MultipartFile file) {
        List<Teacher> teachers = new ArrayList<>();
        try (CSVReader reader = new CSVReader(new InputStreamReader(file.getInputStream()))) {
            String[] nextLine;
            reader.readNext(); // Skip header line
            while ((nextLine = reader.readNext()) != null) {
                Teacher teacher = new Teacher();
                teacher.setNom(nextLine[0]);
                teacher.setPrenom(nextLine[1]);
                teacher.setEmail(nextLine[2]);
                teacher.setDispense(Boolean.parseBoolean(nextLine[3]));

                // Assuming department_id is provided in the CSV and department exists in the database
                String[] finalNextLine = nextLine;
                Department department = departmentRepository.findById(Long.parseLong(nextLine[4]))
                        .orElseThrow(() -> new RuntimeException("Department not found with id: " + finalNextLine[4]));
                teacher.setDepartment(department);

                teachers.add(teacher);
            }
            teacherRepository.saveAll(teachers);
        } catch (Exception e) {
            throw new RuntimeException("Error importing teachers from CSV: " + e.getMessage());
        }
        return teachers;
    }

    public List<Teacher> getTeachersByDepartment(Long departmentId) {
        return teacherRepository.findByDepartment_Id(departmentId);
    }

    @Transactional
    public Teacher createTeacher(TeacherRequest request) {
        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new RuntimeException("Department not found"));

        Teacher teacher = new Teacher();
        teacher.setNom(request.getNom());
        teacher.setPrenom(request.getPrenom());
        teacher.setEmail(request.getEmail());
        teacher.setDispense(request.isDispense());
        teacher.setDepartment(department);

        return teacherRepository.save(teacher);
    }

    @Transactional
    public Teacher updateTeacher(Long id, TeacherRequest request) {
        Teacher teacher = teacherRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new RuntimeException("Department not found"));

        teacher.setNom(request.getNom());
        teacher.setPrenom(request.getPrenom());
        teacher.setEmail(request.getEmail());
        teacher.setDispense(request.isDispense());
        teacher.setDepartment(department);

        return teacherRepository.save(teacher);
    }

    public void deleteTeacher(Long id) {
        teacherRepository.deleteById(id);
    }
}