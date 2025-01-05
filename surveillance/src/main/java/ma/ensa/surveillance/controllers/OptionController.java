package ma.ensa.surveillance.controllers;

import lombok.RequiredArgsConstructor;
import ma.ensa.surveillance.entities.Option;
import ma.ensa.surveillance.services.OptionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/options")
@RequiredArgsConstructor
public class OptionController {
    private final OptionService optionService;

    @PostMapping
    public ResponseEntity<Option> createOption(@RequestBody Map<String, Object> request) {
        return ResponseEntity.ok(optionService.createOption(
                (String) request.get("name"),
                Long.parseLong(request.get("departmentId").toString())
        ));
    }

    @PostMapping("/import")
    public ResponseEntity<List<Option>> importOptions(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(null);
        }

        try {
            List<Option> options = optionService.importOptionsFromCsv(file);
            return ResponseEntity.ok(options);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping
    public ResponseEntity<List<Option>> getAllOptions() {
        return ResponseEntity.ok(optionService.getAllOptions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Option> getOptionById(@PathVariable Long id) {
        return ResponseEntity.ok(optionService.getOptionById(id));
    }

    @GetMapping("/department/{departmentId}")
    public ResponseEntity<List<Option>> getOptionsByDepartment(@PathVariable Long departmentId) {
        return ResponseEntity.ok(optionService.getOptionsByDepartment(departmentId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Option> updateOption(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        return ResponseEntity.ok(optionService.updateOption(
                id,
                (String) request.get("name"),
                Long.parseLong(request.get("departmentId").toString())
        ));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOption(@PathVariable Long id) {
        optionService.deleteOption(id);
        return ResponseEntity.ok().build();
    }
}