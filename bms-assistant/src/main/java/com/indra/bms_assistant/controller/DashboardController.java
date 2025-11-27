package com.indra.bms_assistant.controller;

import com.indra.bms_assistant.service.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final UsuarioService usuarioService;
    private final DocumentoService documentoService;
    private final SistemaBMSService sistemaBMSService;
    private final AgenteIAService agenteIAService;
    private final MetricaSistemaService metricaSistemaService;

    public DashboardController(UsuarioService usuarioService, DocumentoService documentoService,
                               SistemaBMSService sistemaBMSService, AgenteIAService agenteIAService,
                               MetricaSistemaService metricaSistemaService) {
        this.usuarioService = usuarioService;
        this.documentoService = documentoService;
        this.sistemaBMSService = sistemaBMSService;
        this.agenteIAService = agenteIAService;
        this.metricaSistemaService = metricaSistemaService;
    }

    @GetMapping("/estadisticas")
    public Map<String, Object> obtenerEstadisticas() {
        Map<String, Object> estadisticas = new HashMap<>();

        estadisticas.put("totalUsuarios", usuarioService.getAllUsuarios().size());
        estadisticas.put("totalDocumentos", documentoService.getAllDocumentos().size());
        estadisticas.put("totalSistemas", sistemaBMSService.getAllSistemas().size());
        estadisticas.put("totalAgentes", agenteIAService.getAllAgentes().size());
        estadisticas.put("documentosPorEstado", obtenerDocumentosPorEstado());
        estadisticas.put("metricasPromedio", obtenerMetricasPromedio());

        return estadisticas;
    }

    private Map<String, Long> obtenerDocumentosPorEstado() {
        // Implementar lógica para contar documentos por estado
        Map<String, Long> porEstado = new HashMap<>();
        porEstado.put("BORRADOR", documentoService.getAllDocumentos().stream()
                .filter(d -> "BORRADOR".equals(d.getEstado())).count());
        porEstado.put("REVISION", documentoService.getAllDocumentos().stream()
                .filter(d -> "REVISION".equals(d.getEstado())).count());
        porEstado.put("APROBADO", documentoService.getAllDocumentos().stream()
                .filter(d -> "APROBADO".equals(d.getEstado())).count());
        return porEstado;
    }

    private Map<String, Object> obtenerMetricasPromedio() {
        Map<String, Object> metricas = new HashMap<>();
        var todasMetricas = metricaSistemaService.getAllMetricas();

        metricas.put("tiempoPromedioGeneracion", todasMetricas.stream()
                .mapToInt(m -> m.getTiempoGeneracionSegundos() != null ? m.getTiempoGeneracionSegundos() : 0)
                .average().orElse(0));
        metricas.put("totalErrores", todasMetricas.stream()
                .mapToInt(m -> m.getErroresDetectados() != null ? m.getErroresDetectados() : 0)
                .sum());
        metricas.put("satisfaccionPromedio", todasMetricas.stream()
                .mapToInt(m -> m.getSatisfaccionUsuario() != null ? m.getSatisfaccionUsuario() : 0)
                .average().orElse(0));

        return metricas;
    }
}