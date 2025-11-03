package com.indra.bms_assistant.controller;

import com.indra.bms_assistant.model.SistemaBMS;
import com.indra.bms_assistant.service.SistemaBMSService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/sistemas")
public class SistemaBMSController {

    private final SistemaBMSService sistemaBMSService;

    public SistemaBMSController(SistemaBMSService sistemaBMSService) {
        this.sistemaBMSService = sistemaBMSService;
    }

    @GetMapping
    public List<SistemaBMS> obtenerTodosLosSistemas() {
        return sistemaBMSService.getAllSistemas();
    }

    @GetMapping("/activos")
    public List<SistemaBMS> obtenerSistemasActivos() {
        return sistemaBMSService.getSistemasActivos();
    }

    @GetMapping("/usuario/{usuarioId}")
    public List<SistemaBMS> obtenerSistemasPorUsuario(@PathVariable Long usuarioId) {
        return sistemaBMSService.getSistemasPorUsuario(usuarioId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SistemaBMS> obtenerSistemaPorId(@PathVariable Long id) {
        Optional<SistemaBMS> sistema = sistemaBMSService.getSistemaById(id);
        return sistema.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public SistemaBMS crearSistema(@RequestBody SistemaBMS sistema) {
        return sistemaBMSService.crearSistema(sistema);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SistemaBMS> actualizarSistema(@PathVariable Long id, @RequestBody SistemaBMS sistema) {
        SistemaBMS sistemaActualizado = sistemaBMSService.actualizarSistema(id, sistema);
        if (sistemaActualizado != null) {
            return ResponseEntity.ok(sistemaActualizado);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> desactivarSistema(@PathVariable Long id) {
        sistemaBMSService.desactivarSistema(id);
        return ResponseEntity.ok().build();
    }
}