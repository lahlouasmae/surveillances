package ma.ensa.surveillance.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ma.ensa.surveillance.entities.Department;

@Getter
@Setter
@NoArgsConstructor
public class DepartmentDTO {
    private Long id;
    private String name;
    private int teacherCount;
    private int optionCount;

    public static DepartmentDTO fromEntity(Department department) {
        DepartmentDTO dto = new DepartmentDTO();
        dto.setId(department.getId());
        dto.setName(department.getName());
        dto.setTeacherCount(department.getTeachers() != null ? department.getTeachers().size() : 0);
        dto.setOptionCount(department.getOptions() != null ? department.getOptions().size() : 0);
        return dto;
    }
}