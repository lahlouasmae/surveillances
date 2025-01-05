package ma.ensa.surveillance.services;

import com.opencsv.CSVReader;
import lombok.RequiredArgsConstructor;
import ma.ensa.surveillance.entities.Module;
import ma.ensa.surveillance.entities.Option;
import ma.ensa.surveillance.repositories.ModuleRepository;
import ma.ensa.surveillance.repositories.OptionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ModuleService {
    private final ModuleRepository moduleRepository;
    private final OptionService optionService;
    private final OptionRepository optionRepository;

    @Transactional
    public Module createModule(String name, Long optionId) {
        Option option = optionService.getOptionById(optionId);

        if (moduleRepository.existsByNameAndOption(name, option)) {
            throw new RuntimeException("Module with this name already exists in the option");
        }

        Module module = new Module();
        module.setName(name);
        module.setOption(option);
        return moduleRepository.save(module);
    }

    public List<Module> importModulesFromCsv(MultipartFile file) {
        List<Module> modules = new ArrayList<>();
        try (CSVReader reader = new CSVReader(new InputStreamReader(file.getInputStream()))) {
            String[] nextLine;
            reader.readNext(); // Skip header line
            while ((nextLine = reader.readNext()) != null) {
                Module module = new Module();
                module.setName(nextLine[0]);

                // Retrieve and establish the option relationship
                String[] finalNextLine = nextLine;
                Option option = optionRepository.findById(Long.parseLong(nextLine[1]))
                        .orElseThrow(() -> new RuntimeException("Option not found with id: " + finalNextLine[1]));
                module.setOption(option);

                // The exam relationship will be handled separately since it's a OneToOne
                // relationship and might require additional setup
                modules.add(module);
            }
            moduleRepository.saveAll(modules);
        } catch (Exception e) {
            throw new RuntimeException("Error importing modules from CSV: " + e.getMessage());
        }
        return modules;
    }

    public List<Module> getAllModules() {
        return moduleRepository.findAll();
    }

    public Module getModuleById(Long id) {
        return moduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Module not found with id: " + id));
    }

    public List<Module> getModulesByOption(Long optionId) {
        Option option = optionService.getOptionById(optionId);
        return moduleRepository.findByOption(option);
    }

    @Transactional
    public Module updateModule(Long id, String name, Long optionId) {
        Module module = getModuleById(id);
        Option option = optionService.getOptionById(optionId);

        if (!module.getName().equals(name) &&
                moduleRepository.existsByNameAndOption(name, option)) {
            throw new RuntimeException("Module name already exists in this option");
        }

        module.setName(name);
        module.setOption(option);
        return moduleRepository.save(module);
    }

    @Transactional
    public void deleteModule(Long id) {
        if (!moduleRepository.existsById(id)) {
            throw new RuntimeException("Module not found with id: " + id);
        }
        moduleRepository.deleteById(id);
    }
}