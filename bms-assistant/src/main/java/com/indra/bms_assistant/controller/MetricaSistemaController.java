package com.indra.bms_assistant.controller;

import com.indra.bms_assistant.model.MetricaSistema;
import com.indra.bms_assistant.service.MetricaSistemaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/metricas")
public class MetricaSistemaController {

    private final MetricaSistemaService metricaSistemaService;

    public MetricaSistemaController(MetricaSistemaService metricaSistemaService) {
        this.metricaSistemaService = metricaSistemaService;
    }

    @GetMapping
    public List<MetricaSistema> obtenerTodasLasMetricas() {
        return metricaSistemaService.getAllMetricas();
    }

    @GetMapping("/documento/{documentoId}")
    public List<MetricaSistema> obtenerMetricasPorDocumento(@PathVariable Long documentoId) {
        return metricaSistemaService.getMetricasPorDocumento(documentoId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MetricaSistema> obtenerMetricaPorId(@PathVariable Long id) {
        Optional<MetricaSistema> metrica = metricaSistemaService.getMetricaById(id);
        return metrica.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public MetricaSistema crearMetrica(@RequestBody MetricaSistema metrica) {
        return metricaSistemaService.crearMetrica(metrica);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MetricaSistema> actualizarMetrica(@PathVariable Long id, @RequestBody MetricaSistema metrica) {
        MetricaSistema metricaActualizada = metricaSistemaService.actualizarMetrica(id, metrica);
        if (metricaActualizada != null) {
            return ResponseEntity.ok(metricaActualizada);
        }
        return ResponseEntity.notFound().build();
    }
}