package com.indra.bms_assistant.service;

import com.indra.bms_assistant.model.MetricaSistema;
import com.indra.bms_assistant.repository.MetricaSistemaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MetricaSistemaService {

    private final MetricaSistemaRepository metricaSistemaRepository;

    public MetricaSistemaService(MetricaSistemaRepository metricaSistemaRepository) {
        this.metricaSistemaRepository = metricaSistemaRepository;
    }

    public List<MetricaSistema> getAllMetricas() {
        return metricaSistemaRepository.findAll();
    }

    public List<MetricaSistema> getMetricasPorDocumento(Long documentoId) {
        return metricaSistemaRepository.findByDocumentoId(documentoId);
    }

    public Optional<MetricaSistema> getMetricaById(Long id) {
        return metricaSistemaRepository.findById(id);
    }

    public MetricaSistema crearMetrica(MetricaSistema metrica) {
        return metricaSistemaRepository.save(metrica);
    }

    public MetricaSistema actualizarMetrica(Long id, MetricaSistema metricaActualizada) {
        Optional<MetricaSistema> metricaExistente = metricaSistemaRepository.findById(id);
        if (metricaExistente.isPresent()) {
            MetricaSistema metrica = metricaExistente.get();
            metrica.setTiempoGeneracionSegundos(metricaActualizada.getTiempoGeneracionSegundos());
            metrica.setErroresDetectados(metricaActualizada.getErroresDetectados());
            metrica.setObservacionesCalidad(metricaActualizada.getObservacionesCalidad());
            metrica.setSatisfaccionUsuario(metricaActualizada.getSatisfaccionUsuario());
            return metricaSistemaRepository.save(metrica);
        }
        return null;
    }
}