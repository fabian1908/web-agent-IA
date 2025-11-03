package com.indra.bms_assistant.controller;

import com.indra.bms_assistant.model.*;
import com.indra.bms_assistant.repository.*;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
public class TestController {

    private final UsuarioRepository usuarioRepository;
    private final TipoFormatoRepository tipoFormatoRepository;
    private final SistemaBMSRepository sistemaBMSRepository;
    private final DocumentoRepository documentoRepository;

    public TestController(UsuarioRepository usuarioRepository,
                          TipoFormatoRepository tipoFormatoRepository,
                          SistemaBMSRepository sistemaBMSRepository,
                          DocumentoRepository documentoRepository) {
        this.usuarioRepository = usuarioRepository;
        this.tipoFormatoRepository = tipoFormatoRepository;
        this.sistemaBMSRepository = sistemaBMSRepository;
        this.documentoRepository = documentoRepository;
    }

    @GetMapping("/status")
    public Map<String, Object> getStatus() {
        Map<String, Object> status = new HashMap<>();
        status.put("message", "✅ BMS Assistant API funcionando correctamente");
        status.put("timestamp", new java.util.Date());
        status.put("usuarios_registrados", usuarioRepository.count());
        status.put("formatos_disponibles", tipoFormatoRepository.count());
        status.put("sistemas_registrados", sistemaBMSRepository.count());
        status.put("documentos_generados", documentoRepository.count());
        return status;
    }

    @GetMapping("/usuarios")
    public List<Usuario> getAllUsuarios() {
        return usuarioRepository.findAll();
    }

    @GetMapping("/formatos")
    public List<TipoFormato> getAllFormatos() {
        return tipoFormatoRepository.findByActivoTrue();
    }

    @PostMapping("/sistema")
    public SistemaBMS crearSistema(@RequestBody SistemaBMS sistema) {
        return sistemaBMSRepository.save(sistema);
    }

    @GetMapping("/sistemas")
    public List<SistemaBMS> getAllSistemas() {
        return sistemaBMSRepository.findByActivoTrue();
    }

    @PostMapping("/documento")
    public Documento crearDocumento(@RequestBody Documento documento) {
        return documentoRepository.save(documento);
    }

    @GetMapping("/documentos")
    public List<Documento> getAllDocumentos() {
        return documentoRepository.findAll();
    }
}