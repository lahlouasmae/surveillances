package ma.ensa.surveillance.controllers;

import lombok.RequiredArgsConstructor;
import ma.ensa.surveillance.entities.Module;
import ma.ensa.surveillance.services.ModuleService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/modules")
@RequiredArgsConstructor
public class ModuleController {
    private final ModuleService moduleService;

    @PostMapping
    public ResponseEntity<Module> createModule(@RequestBody Map<String, Object> request) {
        return ResponseEntity.ok(moduleService.createModule(
                (String) request.get("name"),
                Long.parseLong(request.get("optionId").toString())
        ));
    }

    @PostMapping("/import")
    public ResponseEntity<List<Module>> importModules(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(null);
        }

        try {
            List<Module> modules = moduleService.importModulesFromCsv(file);
            return ResponseEntity.ok(modules);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping
    public ResponseEntity<List<Module>> getAllModules() {
        return ResponseEntity.ok(moduleService.getAllModules());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Module> getModuleById(@PathVariable Long id) {
        return ResponseEntity.ok(moduleService.getModuleById(id));
    }

    @GetMapping("/option/{optionId}")
    public ResponseEntity<List<Module>> getModulesByOption(@PathVariable Long optionId) {
        return ResponseEntity.ok(moduleService.getModulesByOption(optionId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Module> updateModule(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        return ResponseEntity.ok(moduleService.updateModule(
                id,
                (String) request.get("name"),
                Long.parseLong(request.get("optionId").toString())
        ));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteModule(@PathVariable Long id) {
        moduleService.deleteModule(id);
        return ResponseEntity.ok().build();
    }
}