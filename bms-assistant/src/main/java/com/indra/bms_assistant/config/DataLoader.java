package com.indra.bms_assistant.config;

import com.indra.bms_assistant.model.TipoFormato;
import com.indra.bms_assistant.model.Usuario;
import com.indra.bms_assistant.repository.TipoFormatoRepository;
import com.indra.bms_assistant.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    private final TipoFormatoRepository tipoFormatoRepository;
    private final UsuarioRepository usuarioRepository;

    public DataLoader(TipoFormatoRepository tipoFormatoRepository, UsuarioRepository usuarioRepository) {
        this.tipoFormatoRepository = tipoFormatoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // Insertar tipos de formato si no existen
        if (tipoFormatoRepository.count() == 0) {
            TipoFormato n1 = new TipoFormato("N1", "Formato de Comisionamiento",
                    "Documentación de actividades de comisionamiento del sistema");
            TipoFormato n2 = new TipoFormato("N2", "Reporte de Pruebas",
                    "Reporte técnico de pruebas realizadas al sistema");
            TipoFormato n3 = new TipoFormato("N3", "Documentación Técnica",
                    "Documentación técnica del sistema integrado");

            tipoFormatoRepository.save(n1);
            tipoFormatoRepository.save(n2);
            tipoFormatoRepository.save(n3);

            System.out.println("✅ Tipos de formato N1, N2, N3 insertados");
        }

        // Insertar usuarios de prueba si no existen
        if (usuarioRepository.count() == 0) {
            // Usar password temporal - en producción debería estar encriptado
            // En el DataLoader, cambiar los INSERT de usuarios:
            Usuario admin = new Usuario("admin@indra.com", "admin123", "Admin", "Sistema", "ADMIN", "INDRA", "Sistemas");
            Usuario supervisor = new Usuario("supervisor@indra.com", "super123", "Carlos", "Supervisor", "SUPERVISOR", "INDRA", "HVAC");
            Usuario practicante = new Usuario("practicante@indra.com", "pract123", "Ana", "Practicante", "PRACTICANTE", "INDRA", "Eléctricos");

            usuarioRepository.save(admin);
            usuarioRepository.save(supervisor);
            usuarioRepository.save(practicante);

            System.out.println("✅ Usuarios de prueba insertados con passwords temporales");
        }
    }
}