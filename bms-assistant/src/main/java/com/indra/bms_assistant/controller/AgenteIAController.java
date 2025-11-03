package com.indra.bms_assistant.controller;

import com.indra.bms_assistant.model.AgenteIA;
import com.indra.bms_assistant.service.AgenteIAService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/agentes")
public class AgenteIAController {

    private final AgenteIAService agenteIAService;

    public AgenteIAController(AgenteIAService agenteIAService) {
        this.agenteIAService = agenteIAService;
    }

    @GetMapping
    public List<AgenteIA> obtenerTodosLosAgentes() {
        return agenteIAService.getAllAgentes();
    }

    @GetMapping("/activos")
    public List<AgenteIA> obtenerAgentesActivos() {
        return agenteIAService.getAgentesActivos();
    }

    @GetMapping("/sistema/{sistemaId}")
    public List<AgenteIA> obtenerAgentesPorSistema(@PathVariable Long sistemaId) {
        return agenteIAService.getAgentesPorSistema(sistemaId);
    }

    @GetMapping("/formato/{tipoFormatoId}")
    public List<AgenteIA> obtenerAgentesPorFormato(@PathVariable Long tipoFormatoId) {
        return agenteIAService.getAgentesPorFormato(tipoFormatoId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AgenteIA> obtenerAgentePorId(@PathVariable Long id) {
        Optional<AgenteIA> agente = agenteIAService.getAgenteById(id);
        return agente.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public AgenteIA crearAgente(@RequestBody AgenteIA agente) {
        return agenteIAService.crearAgente(agente);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AgenteIA> actualizarAgente(@PathVariable Long id, @RequestBody AgenteIA agente) {
        AgenteIA agenteActualizado = agenteIAService.actualizarAgente(id, agente);
        if (agenteActualizado != null) {
            return ResponseEntity.ok(agenteActualizado);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> desactivarAgente(@PathVariable Long id) {
        agenteIAService.desactivarAgente(id);
        return ResponseEntity.ok().build();
    }
}