package ma.ensa.surveillance.controllers;

import lombok.RequiredArgsConstructor;
import ma.ensa.surveillance.entities.Local;
import ma.ensa.surveillance.services.LocalService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/locals")
@RequiredArgsConstructor
public class LocalController {
    private final LocalService localService;

    @PostMapping
    public ResponseEntity<Local> createLocal(@RequestBody Map<String, Object> request) {
        return ResponseEntity.ok(localService.createLocal(
                (String) request.get("nom"),
                Integer.parseInt(request.get("taille").toString()),
                (String) request.get("type")
        ));
    }

    @PostMapping("/import")
    public ResponseEntity<List<Local>> importLocals(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(null);
        }

        try {
            List<Local> locals = localService.importLocalsFromCsv(file);
            return ResponseEntity.ok(locals);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping
    public ResponseEntity<List<Local>> getAllLocals() {
        return ResponseEntity.ok(localService.getAllLocals());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Local> getLocalById(@PathVariable Long id) {
        return ResponseEntity.ok(localService.getLocalById(id));
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<Local>> getLocalsByType(@PathVariable String type) {
        return ResponseEntity.ok(localService.getLocalsByType(type));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Local> updateLocal(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        return ResponseEntity.ok(localService.updateLocal(
                id,
                (String) request.get("nom"),
                Integer.parseInt(request.get("taille").toString()),
                (String) request.get("type")
        ));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLocal(@PathVariable Long id) {
        localService.deleteLocal(id);
        return ResponseEntity.ok().build();
    }
}